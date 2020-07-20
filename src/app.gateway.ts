import { Logger } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor () {} 

  @WebSocketServer() wss: Server
  private logger = new Logger("AppGateway");
  
  afterInit(server: Server) {
    this.logger.log("Initialized");
  }
  
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('msgToServer')
  handleToggle(client: Socket, request: any): void {
    this.wss.emit('msgToClient', request);
  }

  @SubscribeMessage('survivorsServer')
  handleSurvival(client: Socket, request: any): void {
    this.wss.emit('survivorsClient');
  }

  handleEliminatedTeam(request: any): void {
    console.log('request', request);
    
    this.wss.emit('eliminatedTeamClient', request);
  }

  toggleSurvivorsVisibility() {
    this.wss.emit('survivorsClient');
  }

  updateData(data: any): void {
    this.wss.emit('update', data);
  }

  updateSurvivors(data: any): void {
    this.wss.emit('survivors', data);
  }
}
