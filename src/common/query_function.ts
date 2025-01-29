import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Brackets, Equal, Repository } from 'typeorm';
import {
  AbstractAttributesName,
  AbstractAttributesType,
  LandlordAttributeName,
  PlaceAttributeName,
  TenantAttributeName,
} from './constants';
import { RELATIONS } from './query_relation_handler';
import { PendingBooking } from '@booking/pending_booking/pending-booking.entity';
import { ActiveBooking } from '@booking/active_booking/active-booking.entity';

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
@InputType()
export class SelectedDate {
  @Field()
  end: number;
  @Field()
  start: number;
}

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
  @Field(() => SelectedDate, { nullable: true })
  selectedDate?: SelectedDate;
}

export interface QueryParams {
  entityFields?: string[];
  pagination?: Pagination;
  queryValue?: string;
  queryType?: string;
  conditions?: Condition[];
  orders?: QueryOrder[];
  relations?: string[];
  selectedDate?: SelectedDate;
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
    selectedDate,
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
          queryBuilder.leftJoinAndSelect(
            MAIN_TABLE + '.' + table,
            attributeName,
          );
          queryBuilder.andWhere(query, {
            [column]: column == 'valueNumber' ? Number(value) : value,
          });
        }
      }
    });
  }

  if (selectedDate)
    if (selectedDate.end && selectedDate.start) {
      const activeBookingTable = 'active_booking';
      queryBuilder.andWhere(
        `
      NOT EXISTS (
      SELECT 1 
      FROM ${activeBookingTable} 
      WHERE ${activeBookingTable}."placeId" = ${MAIN_TABLE}.id 
      AND (${activeBookingTable}."startAt" < :selected_end 
      AND ${activeBookingTable}."endAt" > :selected_start))
      `,
        { selected_start: selectedDate.start, selected_end: selectedDate.end },
      );
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
      var [table, column] = by.includes('.') ? by.split('.') : [MAIN_TABLE, by];
      if (table == MAIN_TABLE) {
        queryBuilder.addSelect(table + '.' + column);
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
        } else if (attributesMap.get(attributeName)) {
          table = attributeName;
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
  optinonalColumns?: string[],
): Promise<any> {
  const fields = [`${column}`];
  const queryBuilder = repository.createQueryBuilder(MAIN_TABLE);
  if (optinonalColumns && optinonalColumns.length > 0) {
    optinonalColumns.forEach((col) => {
      fields.push(`${col}`);
    });
  }
  queryBuilder.select(fields);
  queryBuilder.distinctOn([`${column}`]);

  if (conditions) {
    conditions.forEach((condition) => {
      if (condition.operator == Operator.INCLUDE) {
        queryBuilder.andWhere(`:${condition.key} = ANY(${condition.key})`, {
          [condition.key]: condition.value,
        });
      } else {
        queryBuilder.andWhere(
          `${condition.key} ${condition.operator} :${condition.key}`,
          { [condition.key]: condition.value },
        );
      }
    });
  }
  return queryBuilder.getRawMany();
}
