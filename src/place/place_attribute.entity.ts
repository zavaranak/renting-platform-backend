import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { PlaceAttributeNames } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Place } from './place.entity';

registerEnumType(PlaceAttributeNames, { name: 'PlaceAttributeNames' });

@Entity()
@ObjectType()
export class PlaceAttribute {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'enum', enum: PlaceAttributeNames })
  @Field(() => PlaceAttributeNames)
  name: PlaceAttributeNames;

  @Column({ type: 'boolean' })
  @Field()
  value: boolean;

  @ManyToOne(() => Place, (place) => place.attributes)
  @Field(() => Place)
  place: Place;

  //   @Column({ type: 'enum', enum: AttributeTypes })
  //   @Field(() => AttributeTypes)
  //   type: AttributeTypes;
}
