import { Repository } from 'typeorm';

export interface QueryParams {
  take?: number;
  skip?: number;
  queryValue?: string;
  queryType?: string;
  where?: any;
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
  const { take, skip, queryValue, queryType, where, order, relations } = params;
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
