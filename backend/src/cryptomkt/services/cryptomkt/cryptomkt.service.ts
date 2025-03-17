import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CryptomktService {
  private readonly logger = new Logger(CryptomktService.name);
  private readonly apiUrl = 'https://api.exchange.cryptomkt.com/api/3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getExchangeRate(from: string, to: string): Promise<number> {
    try {
      // Primero intentamos obtener la tasa directa
      try {
        const directRate = await this.getRateFromApi(from, to);
        return directRate;
      } catch (error) {
        this.logger.warn(`No se encontró tasa directa para ${from}-${to}, intentando con USDT como puente`);
        
        // Si no hay tasa directa, intentamos usar USDT como puente
        const fromToUsdt = await this.getRateFromApi(from, 'USDT');
        const usdtToTarget = await this.getRateFromApi('USDT', to);
        
        return fromToUsdt * usdtToTarget;
      }
    } catch (error) {
      this.logger.error(`Error al obtener tasa de cambio: ${error.message}`);
      
      // Tasas simuladas como fallback
      const fallbackRates = {
        'ARS-ETH': 0.0000023,
        'ETH-ARS': 434782.61,
        'ARS-BTC': 0.0000000089,
        'BTC-ARS': 112359550.56,
        'ARS-USDC': 0.001149,
        'USDC-ARS': 870.32,
        'ETH-BTC': 0.053,
        'BTC-ETH': 18.87,
        'ETH-USDC': 3500.00,
        'USDC-ETH': 0.000286,
        'ARS-USDT': 0.001149,
        'USDT-ARS': 870.32,
        'ETH-USDT': 3500.00,
        'USDT-ETH': 0.000286,
        'BTC-USDT': 65000.00,
        'USDT-BTC': 0.0000153846,
        
        'CLP-ETH': 0.0000002,
        'ETH-CLP': 5000000,
        'CLP-BTC': 0.0000000077,
        'BTC-CLP': 130000000,
        'CLP-USDC': 0.001,
        'USDC-CLP': 1000,
        
        'MXN-ETH': 0.0000012,
        'ETH-MXN': 833333.33,
        'MXN-BTC': 0.0000000462,
        'BTC-MXN': 21645021.65,
        'MXN-USDC': 0.059,
        'USDC-MXN': 16.95,
        
        'USD-ETH': 0.02,
        'ETH-USD': 50,
        'USD-BTC': 0.000077,
        'BTC-USD': 13000,
        'USD-USDC': 1,
        'USDC-USD': 1
      };

      const pair = `${from}-${to}`;
      if (fallbackRates[pair]) {
        this.logger.warn(`Usando tasa simulada para ${pair}`);
        return fallbackRates[pair];
      }

      throw new Error(`Par de monedas no soportado: ${from}-${to}`);
    }
  }

  private async getRateFromApi(from: string, to: string): Promise<number> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/public/price/rate`, {
        params: {
          from: from,
          to: to
        }
      })
    );

    if (!response.data || !response.data.rate) {
      throw new Error(`No se encontró tasa de cambio para el par ${from}-${to}`);
    }

    return parseFloat(response.data.rate);
  }
}
