import { Field, ObjectType } from '@nestjs/graphql';
import { Currency } from '../currency.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'currency_attributes' })
@ObjectType()
export class CurrencyAttribute {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  value: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  name: string;

  @ManyToOne(() => Currency, (currency) => currency.attributes)
  @Field(() => Currency)
  currency: Currency;
}
