import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CryptomktModule } from '../cryptomkt/cryptomkt.module';

@Module({
  imports: [PrismaModule, CryptomktModule],
  providers: [QuotesService],
  controllers: [QuotesController]
})
export class QuotesModule {}
