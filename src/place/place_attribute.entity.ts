import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
import { PlaceAttributeName } from 'src/common/constants';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Place } from './place.entity';

registerEnumType(PlaceAttributeName, { name: 'PlaceAttributeNames' });

@Entity()
@ObjectType()
export class PlaceAttribute {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'enum', enum: PlaceAttributeName })
  @Field(() => PlaceAttributeName)
  name: PlaceAttributeName;

  @Column({ type: 'integer', nullable: true })
  @Field(() => Number)
  valueNumber?: number;

  @Column({ type: 'varchar' })
  value: string;

  @ManyToOne(() => Place, (place) => place.attributes)
  @Field(() => Place)
  place: Place;
}
