import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LandlordAttributeName } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Landlord } from './landlord.entity';

registerEnumType(LandlordAttributeName, { name: 'LandlordAttributeNames' });
@ObjectType()
@Entity()
export class LandlordAttribute {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Field(() => LandlordAttributeName)
  @Column({ type: 'enum', enum: LandlordAttributeName })
  name: LandlordAttributeName;

  @Field()
  @Column({ type: 'varchar' })
  value: string;

  @Field()
  @Column({ type: 'varchar' })
  type: string;

  @ManyToOne(() => Landlord, (landlord) => landlord.attributes)
  @Field(() => Landlord)
  landlord: Landlord;
}
