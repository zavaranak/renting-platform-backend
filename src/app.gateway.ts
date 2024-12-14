import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
  // MessageBody,
  // ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notifcation/notification.service';

@WebSocketGateway({ namespace: 'notification' }) // Namespace can be '/' for simplicity
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // private authService: AuthService,
    private notificationService: NotificationService,
  ) {}

  @WebSocketServer() io: Server;

  afterInit() {
    this.notificationService.setServer(this.io);
  }

  // chatChannel: Namespace;
  // notificationChannel: Namespace;

  // afterInit() {
  //   this.chatChannel = this.io.of('/chat'); // Create 'chat' namespace
  //   this.notificationChannel = this.io.of('/notification'); // Create 'notification' namespace

  //   // Example: Setup events for chatChannel
  //   this.chatChannel.on('connection', (socket) => {
  //     console.log(`Client connected to chat: ${socket.id}`);
  //     socket.on('message', (data) => {
  //       console.log(`Chat message received: ${data}`);
  //     });
  //   });

  //   // Example: Setup events for notificationChannel
  //   this.notificationChannel.on('connection', async (client) => {
  //     await this.notificationService.handleNewClient(client);
  //   });

  //   this.notificationChannel.on('notify', async (data) => {
  //     // await this.notificationService.handleNotification(client)
  //     console.log(data);
  //   });
  // }

  // Handle client connection
  async handleConnection(client: Socket) {
    await this.notificationService.handleNewClient(client);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  //   @SubscribeMessage('notify')
  //   async handleNotifyEvent(
  //     @MessageBody() data: any,
  //     @ConnectedSocket() client: Socket,
  //   ) {
  //     await this.notificationService.handleNotification(client, data);
  //   }
}
