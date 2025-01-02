import { Field, ObjectType } from '@nestjs/graphql';
import { Roles } from 'src/auth/dto/auth_input';
import { NotificationType } from 'src/common/constants';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id?: string;

  @Column({ type: 'enum', enum: NotificationType })
  @Field(() => NotificationType)
  type: NotificationType;

  @Column({ type: 'bigint', nullable: true })
  @Field()
  createdAt: number;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  target: string;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  bookingId?: string;

  @Column({ type: 'varchar', nullable: true })
  @Field()
  placeId?: string;

  @Column({ type: 'enum', enum: Roles, nullable: false })
  @Field(() => Roles)
  targetRole: Roles;
}
