import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuoteDto {
  @ApiProperty({ 
    example: 1000000,
    description: 'Monto a convertir'
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({ 
    example: 'ARS',
    description: 'Código de la moneda origen (Ej.: ARS, CLP, MXN, USDC, BTC, ETH)'
  })
  @IsString()
  from: string;

  @ApiProperty({ 
    example: 'ETH',
    description: 'Código de la moneda destino (Ej.: ETH, USDC, CLP, USD, ARS)'
  })
  @IsString()
  to: string;
}
