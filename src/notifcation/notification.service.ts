import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/auth/dto/auth_input';
import dayjs from 'dayjs';
import { NotificationData, NotificationType } from 'src/common/constants';

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

  constructor(private authService: AuthService) {}

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
        this.handleNotification(data);
      });
    } else {
      console.log(data);
      console.log('disconnected');
      client.disconnect(true);
    }
  }

  async handleNotification(data: NotificationData) {
    if (data) {
      console.log(data);
      const { type, target } = data;
      if (
        [
          NotificationType.LANDLORD_ACCEPT_REQUEST,
          NotificationType.LANDLORD_CANCEL_REQUEST,
          NotificationType.LANDLORD_NEW_REQUEST,
        ].includes(type)
      ) {
        console.log('landlord sending notification to ', target);
        console.log(this.connectedLandlords.get(target));
        console.log(this.connectedTenants.get(target));
        this.server.to(target).emit('message', 'test notification');
      }
    }
  }
}
