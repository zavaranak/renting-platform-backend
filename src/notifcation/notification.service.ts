import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class NotificationService {
  public connectedClients = new Map<
    string,
    {
      socketId: string;
      userId: string;
      lastActive: Date;
    }
  >();

  constructor(private authService: AuthService) {}

  async handleNewClient(client: Socket) {
    const jwt = client.handshake.headers.authorization?.split(' ')[1];
    if (jwt) {
      const data = await this.authService.verifyJwt(jwt);
      console.log(data);
      console.log(`Client connected to notification: ${client.id}`);
    } else {
      client.disconnect(true);
    }
  }
}
