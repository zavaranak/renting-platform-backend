import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Repository } from 'typeorm';

export enum operator {
  EQUAL = '=',
  GREATER = '>',
  SMALLER = '<',
  GREATER_AND_EQUAL = '>=',
  SMALLER_AND_EQUAL = '<=',
  INCLUDE = 'INCLUDE',
}
registerEnumType(operator, { name: 'operator' });

@InputType()
export class Condition {
  @Field()
  key: string;
  @Field()
  value: string;
  @Field(() => operator)
  operator: operator;
}

@InputType()
export class Pagination {
  @Field()
  take: number;
  @Field()
  skip: number;
}
@InputType()
export class QueryManyInput {
  @Field()
  conditions: Condition[];
  @Field({ defaultValue: { skip: 0, take: 20 } })
  pagination: Pagination;
}
export interface QueryParams {
  pagination?: Pagination;
  queryValue?: string;
  queryType?: string;
  where?: Condition[];
  order?: any;
  relations?: string[];
}

export async function queryOne<T>(
  repository: Repository<T>,
  params: QueryParams,
): Promise<T> {
  const { queryValue, queryType, where, relations } = params;
  const queryBuilder = repository.createQueryBuilder('target_entity');
  Array.isArray(relations) &&
    relations.forEach((relation, index) => {
      queryBuilder.leftJoinAndSelect(
        `target_entity.${relation}`,
        `relation${index}`,
      );
    });

  if (queryValue && queryType) {
    queryBuilder.where(`target_entity.${queryType} = :queryValue`, {
      queryValue,
    });
  }

  if (where) {
    queryBuilder.andWhere(where);
  }
  return await queryBuilder.getOne();
}

export async function queryMany<T>(
  repository: Repository<T>,
  params: QueryParams,
): Promise<T[]> {
  const { pagination, queryValue, queryType, where, order, relations } = params;
  const { take, skip } = pagination;
  const queryBuilder = repository.createQueryBuilder('target_entity');

  console.log('relations:', relations);
  Array.isArray(relations) &&
    relations.forEach((relation, index) => {
      queryBuilder.leftJoinAndSelect(
        `target_entity.${relation}`,
        `relation${index}`,
      );
    });

  if (queryValue && queryType) {
    queryBuilder.where(`target_entity.${queryType} = :queryValue`, {
      queryValue,
    });
  }
  if (where) {
    where.forEach((condition) => {
      if (condition.operator == operator.INCLUDE) {
        queryBuilder.andWhere(
          `:${condition.key} = ANY(target_entity.${condition.key})`,
          { [condition.key]: condition.value },
        );
      } else {
        queryBuilder.andWhere(
          `target_entity.${condition.key} ${condition.operator} :${condition.key}`,
          { [condition.key]: condition.value },
        );
      }
    });
  }
  if (order) {
    queryBuilder.orderBy(order);
  }
  if (take) {
    queryBuilder.take(take);
  }
  if (skip) {
    queryBuilder.skip(skip);
  }
  return await queryBuilder.getMany();
}
