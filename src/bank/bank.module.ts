import { Module } from '@nestjs/common';
import { BankResolver } from './bank.resolver';

@Module({
  providers: [BankResolver],
})
export class BankModule {}
