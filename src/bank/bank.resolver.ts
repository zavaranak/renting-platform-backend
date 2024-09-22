import { Resolver, Query, Args } from '@nestjs/graphql';
import { Bank } from './bank.model';
import { mockData } from 'src/common/language_codes/mock/mock';

@Resolver(() => Bank)
export class BankResolver {
  @Query(() => [Bank])
  getAllBanks() {
    return mockData.mockBankData;
  }
  @Query(() => Bank, { nullable: true })
  getBank(@Args('id') id: string) {
    return mockData.mockBankData.find((bank) => bank.id === id);
  }
}
