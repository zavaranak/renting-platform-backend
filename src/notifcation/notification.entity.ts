import { Field, ObjectType } from '@nestjs/graphql';
import { NotificationType } from 'src/common/constants';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  @Field(() => NotificationType)
  type: NotificationType;

  @Column({ type: 'bigint', nullable: true })
  @Field()
  createdAt: number;

  @Column({ type: 'boolean', nullable: true })
  @Field()
  seen: boolean;

  @Column({ type: 'varchar', nullable: false })
  @Field()
  userId: string;
}
