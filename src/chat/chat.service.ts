export class ChatService {
  private connectedClients = new Map<
    string,
    {
      socketId: string;
      userId: string;
      lastActive: Date;
    }
  >();
}
