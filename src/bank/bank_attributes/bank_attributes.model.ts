import { ObjectType, Field } from '@nestjs/graphql';
import { Bank } from '../bank.model';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'bank_attributes' })
@ObjectType()
export class BankAttribute {
  @PrimaryGeneratedColumn()
  @Field()
  id: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  name: string;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  value: string;

  @ManyToOne(() => Bank, (bank) => bank.attributes)
  @Field(() => Bank)
  bank: Bank;
}
