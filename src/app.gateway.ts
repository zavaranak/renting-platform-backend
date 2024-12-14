import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // SubscribeMessage,
  // MessageBody,
} from '@nestjs/websockets';
import { Server, Socket, Namespace } from 'socket.io';
import { AuthService } from './auth/auth.service';
import { NotificationService } from './notifcation/notification.service';

@WebSocketGateway() // Namespace can be '/' for simplicity
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    // private authService: AuthService,
    private notificationService: NotificationService,
  ) {}
  @WebSocketServer() io: Server;

  chatChannel: Namespace;
  notificationChannel: Namespace;

  afterInit() {
    this.chatChannel = this.io.of('/chat'); // Create 'chat' namespace
    this.notificationChannel = this.io.of('/notification'); // Create 'notification' namespace

    // Example: Setup events for chatChannel
    this.chatChannel.on('connection', (socket) => {
      console.log(`Client connected to chat: ${socket.id}`);
      socket.on('message', (data) => {
        console.log(`Chat message received: ${data}`);
      });
    });

    // Example: Setup events for notificationChannel
    this.notificationChannel.on('connection', async (client) => {
      await this.notificationService.handleNewClient(client);

      client.on('notify', (data) => {
        console.log(data);
        console.log(`Notification received: ${data}`);
      });
    });
  }

  // Handle client connection
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.disconnect(true);
  }

  // Handle client disconnection
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Send notification to a specific client
  // @SubscribeMessage('notification') // Listening for 'notification' event
  // handleNotification(
  //   @MessageBody() payload: { clientId: string; notification: string },
  // ) {
  //   const { clientId, notification } = payload;
  //   console.log(`Sending notification to ${clientId}: ${notification}`);

  //   // Send the notification to the specified client
  //   try {
  //     this.io.to(clientId).emit('notification', {
  //       type: 'notification',
  //       data: notification,
  //     });
  //   } catch (e) {
  //     console.log('error: ', e);
  //   }
  // }

  // // Send chat message
  // @SubscribeMessage('message')
  // sendChatMessage(receiverId: string, message: any) {
  //   this.io.to(receiverId).emit('message', {
  //     type: 'chat',
  //     data: message,
  //   });
  // }
}
