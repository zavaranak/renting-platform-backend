// import { Resolver, Query, Args } from '@nestjs/graphql';
// import { CurrencyAttribute } from './currency_attributes.model';
// import { mockData } from 'src/common/language_codes/mock/mock';

// @Resolver(() => CurrencyAttribute)
// export class CurrencyAttributeResolver {
//   @Query(() => [CurrencyAttribute])
//   getAllAttributesOfCurrency(@Args('currencyId') currencyId: string) {
//     return mockData.mockCurencyAttributeData.find(
//       (currencyAttribute) => currencyAttribute.currencyId === currencyId,
//     );
//   }
// }
