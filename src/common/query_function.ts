import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Repository } from 'typeorm';
import {
  AbstractAttributesName,
  AbstractAttributesType,
  LandlordAttributeName,
  PlaceAttributeName,
  TenantAttributeName,
} from './constants';
import { RELATIONS } from './query_relation_handler';

export enum Operator {
  EQUAL = '=',
  GREATER = '>',
  SMALLER = '<',
  GREATER_AND_EQUAL = '>=',
  SMALLER_AND_EQUAL = '<=',
  INCLUDE = 'INCLUDE',
}
export enum Order {
  asc = 'ASC',
  desc = 'DESC',
}

export const MAIN_TABLE = 'mainTable';
const attributeTable = 'attributes';

registerEnumType(Operator, { name: 'operator' });
registerEnumType(Order, { name: 'order' });
registerEnumType(AbstractAttributesName, { name: 'attributeName' });

@InputType()
export class Condition {
  @Field()
  key: string;
  @Field(() => AbstractAttributesName, { nullable: true })
  attributeName?: AbstractAttributesType;
  @Field()
  value: string;
  @Field(() => Operator)
  operator: Operator;
}

@InputType()
export class Pagination {
  @Field()
  take: number;
  @Field()
  skip: number;
}

@InputType()
export class QueryOrder {
  @Field(() => AbstractAttributesName, { nullable: true })
  attributeName?: AbstractAttributesType;
  @Field()
  by: string;
  @Field(() => Order)
  order: Order;
}
@InputType()
export class QueryManyInput {
  @Field(() => [Condition])
  conditions: Condition[];
  @Field({ defaultValue: { skip: 0, take: 100 } })
  pagination: Pagination;
  @Field(() => [QueryOrder], { nullable: true })
  orderBy?: [QueryOrder];
}
export interface QueryParams {
  entityFields?: string[];
  pagination?: Pagination;
  queryValue?: string;
  queryType?: string;
  conditions?: Condition[];
  orders?: QueryOrder[];
  relations?: string[];
  // relationFields?: Map<string, string[]>;
  // subRelationFields?: Map<string, string[]>;
}

export async function queryOne<T>(
  repository: Repository<T>,
  params: QueryParams,
): Promise<T> {
  const { queryValue, queryType, conditions, relations, entityFields } = params;
  const queryBuilder = repository.createQueryBuilder(MAIN_TABLE);

  Array.isArray(entityFields) &&
    entityFields.length > 0 &&
    queryBuilder.select(entityFields);

  Array.isArray(relations) &&
    relations.forEach((relation, index) => {
      queryBuilder.leftJoinAndSelect(
        `${MAIN_TABLE}.${relation}`,
        `relation${index}`,
      );
    });

  if (queryValue && queryType) {
    queryBuilder.where(`${MAIN_TABLE}.${queryType} = :queryValue`, {
      queryValue,
    });
  }

  if (conditions) {
    queryBuilder.andWhere(conditions);
  }
  return await queryBuilder.getOne();
}

export async function queryMany<T>(
  repository: Repository<T>,
  params: QueryParams,
): Promise<T[]> {
  console.log(params);
  const attributesMap = new Map<PlaceAttributeName, boolean>();
  const {
    pagination,
    queryValue,
    queryType,
    conditions,
    orders,
    relations,
    entityFields,
  } = params;
  const { take, skip } = pagination;

  const queryBuilder = repository.createQueryBuilder(MAIN_TABLE);

  Array.isArray(entityFields) &&
    entityFields.length > 0 &&
    queryBuilder.select(entityFields);

  if (queryValue && queryType) {
    queryBuilder.where(`${MAIN_TABLE}.${queryType} = :queryValue`, {
      queryValue,
    });
  }
  Array.isArray(relations) &&
    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(MAIN_TABLE + '.' + relation, relation);
    });
  if (conditions) {
    conditions.forEach((condition) => {
      const { operator, value, attributeName } = condition;
      const [table, column] = condition.key.includes('.')
        ? condition.key.split('.')
        : [MAIN_TABLE, condition.key];
      if (table == MAIN_TABLE) {
        const query =
          operator == Operator.INCLUDE
            ? `:${column} = ANY(${table}.${column})`
            : `${table}.${column} ${operator} :${column}`;
        queryBuilder.andWhere(query, {
          [column]: value,
        });
      } else if (RELATIONS.includes(table)) {
        const query =
          operator == Operator.INCLUDE
            ? `:${column} = ANY(${attributeName}.${column})`
            : `${attributeName}.${column} ${operator} :${column}`;
        if (attributesMap.get(attributeName)) {
          queryBuilder.andWhere(query, { [column]: value });
        } else {
          attributesMap.set(attributeName, true);
          queryBuilder.leftJoin(
            MAIN_TABLE + '.' + table,
            attributeName,
            query,
            {
              [column]: value,
            },
          );
          // queryBuilder.orderBy(attributeName + '.' + 'valueNumber', 'ASC');
        }
      }
    });
  }
  if (take) {
    queryBuilder.take(take);
  }
  if (skip) {
    queryBuilder.skip(skip);
  }

  if (orders) {
    orders.forEach((orderBy: QueryOrder, index: number) => {
      const { order, by, attributeName } = orderBy;
      const [table, column] = by.includes('.')
        ? by.split('.')
        : [MAIN_TABLE, by];
      if (table == MAIN_TABLE) {
        if (!entityFields.includes(column)) {
          queryBuilder.addSelect(MAIN_TABLE + '.' + column);
        }
        queryBuilder.addOrderBy(table + '.' + column, order);
      } else if (RELATIONS.includes(table)) {
        var sqlType = '';
        if (Object.values(PlaceAttributeName).includes(attributeName)) {
          sqlType = 'place_attribute_name_enum';
        }
        if (Object.values(TenantAttributeName).includes(attributeName)) {
          sqlType = 'tenant_attribute_name_enum';
        }
        if (Object.values(LandlordAttributeName).includes(attributeName)) {
          sqlType = 'landlord_attribute_name_enum';
        }
        const query = `${table}.name = :value::${sqlType}`;
        if (relations.includes(table)) {
          queryBuilder.andWhere(query, {
            value: attributeName,
          });
        } else {
          relations.push(table);
          queryBuilder.leftJoinAndSelect(
            MAIN_TABLE + '.' + table,
            table,
            `${table}.name = :value::place_attribute_name_enum`,
            {
              value: attributeName,
            },
          );
        }
        queryBuilder.addOrderBy(table + '.' + column, order);
      }
    });
  }
  return await queryBuilder.getMany();
}

export async function queryDistinct<T>(
  repository: Repository<T>,
  column: string,
  conditions?: Condition[],
): Promise<any> {
  const queryBuilder = repository.createQueryBuilder(MAIN_TABLE);
  queryBuilder.select(`DISTINCT ${MAIN_TABLE}.${column}`);
  if (conditions) {
    conditions.forEach((condition) => {
      if (condition.operator == Operator.INCLUDE) {
        queryBuilder.andWhere(
          `:${condition.key} = ANY(${MAIN_TABLE}.${condition.key})`,
          { [condition.key]: condition.value },
        );
      } else {
        queryBuilder.andWhere(
          `${MAIN_TABLE}.${condition.key} ${condition.operator} :${condition.key}`,
          { [condition.key]: condition.value },
        );
      }
    });
  }
  return queryBuilder.getRawMany();
}
