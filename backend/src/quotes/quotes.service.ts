import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto/create-quote.dto';
import { CryptomktService } from '../cryptomkt/services/cryptomkt/cryptomkt.service';

@Injectable()
export class QuotesService {
  constructor(
    private prisma: PrismaService,
    private cryptomktService: CryptomktService
  ) {}

  async create(createQuoteDto: CreateQuoteDto, userId: string) {
    try {
      // Obtener el rate desde CryptoMKT
      const rate = await this.cryptomktService.getExchangeRate(
        createQuoteDto.from,
        createQuoteDto.to
      );
      
      // Calcular el monto convertido
      const convertedAmount = createQuoteDto.amount * rate;
      
      // Crear la cotización
      const quote = await this.prisma.quote.create({
        data: {
          from: createQuoteDto.from,
          to: createQuoteDto.to,
          amount: createQuoteDto.amount,
          rate,
          convertedAmount,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutos de expiración
          userId,
        },
      });

      return quote;
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }

    // Verificar si la cotización expiró
    if (quote.expiresAt < new Date()) {
      throw new NotFoundException('La cotización ha expirado');
    }

    return quote;
  }
}
