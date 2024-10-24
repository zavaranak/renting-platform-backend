import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LandlordAttributeNames } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Landlord } from './landlord.entity';

registerEnumType(LandlordAttributeNames, { name: 'LandlordAttributeNames' });
// registerEnumType(AttributeTypes, { name: 'AttributeTypes' });
@ObjectType()
@Entity()
export class LandlordAttribute {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Field(() => LandlordAttributeNames)
  @Column({ type: 'enum', enum: LandlordAttributeNames })
  name: LandlordAttributeNames;

  @Field()
  @Column()
  value: string;

  @Field()
  @Column({ type: 'varchar' })
  type: string;

  @ManyToOne(() => Landlord, (landlord) => landlord.attributes)
  @Field(() => Landlord)
  landlord: Landlord;
}
