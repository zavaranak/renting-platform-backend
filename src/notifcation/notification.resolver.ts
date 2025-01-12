import { Resolver, Query, Context } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
// import { Notification } from './notification.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/graphql.auth-guard';
import { QueryResponse } from 'src/common/reponse';
import { Operator, QueryParams } from 'src/common/query_function';
import { ActionStatus } from 'src/common/constants';

@Resolver()
export class NotificationResolver {
  constructor(private notiifcationService: NotificationService) {}

  @Query(() => QueryResponse)
  @UseGuards(JwtAuthGuard)
  async getNotifications(@Context() context: any): Promise<QueryResponse> {
    if (!context.req.user)
      return {
        message: 'not found',
        notifications: undefined,
        type: ActionStatus.FAILED,
      };
    const { id, role } = context.req.user;
    if (!id)
      return {
        message: 'user not found',
        type: ActionStatus.FAILED,
      };
    if (!role)
      return {
        message: 'user not found',
        type: ActionStatus.FAILED,
      };
    const queryParams: QueryParams = {
      queryValue: id,
      queryType: 'target',
      conditions: [
        {
          key: 'targetRole',
          value: role,
          operator: Operator.EQUAL,
        },
      ],
    };
    const notifications = await this.notiifcationService.getMany(queryParams);
    console.log(notifications);
    if (Array.isArray(notifications)) {
      return {
        message: 'notifications found',
        notifications: notifications,
        type: ActionStatus.SUCCESSFUL,
      };
    }
  }
}
