import { Injectable, Inject } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/auth/dto/auth_input';
import dayjs from 'dayjs';
import { NotificationData, NotificationType } from 'src/common/constants';
import { Notification } from './notification.entity';
import { Repository, DataSource } from 'typeorm';
import { QueryParams, queryMany } from 'src/common/query_function';
@Injectable()
export class NotificationService {
  public connectedTenants = new Map<
    string,
    [
      {
        socketId: string;
        userId: string;
        lastActive: number;
      },
    ]
  >();
  public connectedLandlords = new Map<
    string,
    [
      {
        socketId: string;
        userId: string;
        lastActive: number;
      },
    ]
  >();

  private server: Server;

  private notificationRepository: Repository<Notification>;

  constructor(
    private authService: AuthService,
    @Inject('DATA_SOURCE_PSQL') private datasource: DataSource,
  ) {
    this.notificationRepository = this.datasource.getRepository(Notification);
  }

  setServer(server: Server) {
    this.server = server;
  }

  async verifyClient(client: Socket) {
    const jwt = client.handshake.headers.authorization?.split(' ')[1];
    if (jwt) {
      try {
        const data = await this.authService.verifyJwt(jwt);
        return data;
      } catch (e) {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  async handleNewClient(client: Socket) {
    const data = await this.verifyClient(client);
    if (data) {
      console.log(`Client connected to notification: ${client.id}`);
      const { id, role } = data;
      client.join(id);

      if (role === Roles.LANDLORD) {
        const newLandLordClient = {
          socketId: client.id,
          userId: id,
          lastActive: dayjs().valueOf(),
        };
        if (!this.connectedLandlords.has(id)) {
          this.connectedLandlords.set(id, [newLandLordClient]);
        } else {
          this.connectedLandlords.get(id).push(newLandLordClient);
        }
      }
      if (role === Roles.TENANT) {
        const newTenantClient = {
          socketId: client.id,
          userId: id,
          lastActive: dayjs().valueOf(),
        };
        if (!this.connectedTenants.has(id)) {
          this.connectedTenants.set(id, [newTenantClient]);
        } else {
          this.connectedTenants.get(id).push(newTenantClient);
        }
      }

      client.on('notify', (data) => {
        this.handleNotification(role, data);
      });
    } else {
      console.log('disconnected');
      client.disconnect(true);
    }
  }

  async handleNotification(role: Roles, data: NotificationData) {
    if (data) {
      console.log(data);
      const { type, target, bookingId, placeId } = data;
      if (
        role === Roles.LANDLORD &&
        [
          NotificationType.LANDLORD_ACCEPT_REQUEST,
          NotificationType.LANDLORD_CANCEL_REQUEST,
          NotificationType.LANDLORD_NEW_REQUEST,
        ].includes(type)
      ) {
        console.log('landlord sending notification to ', target);
        console.log(this.connectedTenants.get(target));
        this.server.to(target).emit('message', 'test notification from target');
        this.notificationRepository.save({
          targetRole: Roles.TENANT,
          type: type,
          target: target,
          createdAt: dayjs().valueOf(),
        });
      }
      if (
        role === Roles.TENANT &&
        [
          NotificationType.TENANT_ACCEPT_REQUEST,
          NotificationType.TENANT_CANCEL_REQUEST,
          NotificationType.TENANT_NEW_REQUEST,
        ].includes(type)
      ) {
        this.server.to(target).emit('notify', 'test notification from tenant');
        const notification: Notification = {
          targetRole: Roles.LANDLORD,
          type: type,
          target: target,
          createdAt: dayjs().valueOf(),
        };
        if (placeId) notification.placeId = placeId;
        if (bookingId) notification.bookingId = bookingId;
        this.notificationRepository.save(notification);
      }
    }
  }
  async getMany(queryParams: QueryParams): Promise<Notification[]> {
    return await queryMany(this.notificationRepository, queryParams);
  }
}
