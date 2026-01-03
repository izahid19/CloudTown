import { io, Socket } from 'socket.io-client';
import type { PlayerData, MultiplayerMessage } from './types';

type MessageHandler = (message: MultiplayerMessage) => void;

const SOCKET_SERVER_URL = process.env.BACKEND_SOCKET_URL || 'http://localhost:5000';

interface ProfileData {
  username: string;
  about: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
  github?: string;
}

export default class NetworkManager {
  private roomId: string;
  private userId: string;
  private userName: string;
  private userImage?: string;
  private userProfile?: ProfileData;
  private socket: Socket | null = null;
  private messageHandlers: MessageHandler[] = [];
  private lastBroadcastTime: number = 0;
  private broadcastInterval: number = 50; // ~20 FPS

  constructor(roomId: string, userId: string, userName: string, userImage?: string, userProfile?: ProfileData) {
    this.roomId = roomId;
    this.userId = userId;
    this.userName = userName;
    this.userImage = userImage;
    this.userProfile = userProfile;
  }

  async connect() {
    try {
      // Connect to Socket.io server
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
      });

      // Wait for connection
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000);

        this.socket!.on('connect', () => {
          clearTimeout(timeout);
          console.log('[NetworkManager] Connected to server');
          resolve();
        });

        this.socket!.on('connect_error', (err) => {
          clearTimeout(timeout);
          console.error('[NetworkManager] Connection error:', err);
          reject(err);
        });
      });

      // Join the room
      this.socket.emit('joinRoom', {
        roomId: this.roomId,
        userId: this.userId,
        userName: this.userName,
        userImage: this.userImage,
        userProfile: this.userProfile,
      });

      // Handle joined room (get existing players)
      // Handle joined room (get existing players)
      this.socket.on('joinedRoom', (data: { players: PlayerData[], myProfile?: ProfileData }) => {
        console.log(`[NetworkManager] Joined room with ${data.players.length} existing players`);
        
        // Update own profile if server sent one (it's the source of truth)
        if (data.myProfile) {
          console.log('[NetworkManager] Received authoritative profile from server', data.myProfile);
          this.userProfile = data.myProfile;
          this.userName = data.myProfile.username;
          this.notifyHandlers({
            type: 'self-profile-update',
            data: data.myProfile
          });
        }

        data.players.forEach((player) => {
          this.notifyHandlers({
            type: 'player-join',
            data: player,
          });
        });
      });

      // Handle new player joining
      this.socket.on('playerJoined', (player: PlayerData) => {
        console.log(`[NetworkManager] Player joined: ${player.name}`);
        this.notifyHandlers({
          type: 'player-join',
          data: player,
        });
      });

      // Handle player movement
      this.socket.on('playerMoved', (data: PlayerData) => {
        this.notifyHandlers({
          type: 'player-update',
          data,
        });
      });

      // Handle profile updates
      this.socket.on('playerProfileUpdated', (data: { id: string, profile: ProfileData, name: string }) => {
        console.log(`[NetworkManager] Player ${data.name} updated profile`);
        // We synthesize a player-update message with the new profile
        this.notifyHandlers({
          type: 'player-update',
          data: {
            id: data.id,
            name: data.name,
            x: 0, // These will be ignored or merged by GameScene logic if well handled, 
                  // but we should ideally just trigger profile update.
                  // For now reusing player-update is easiest if GameScene handles it.
            y: 0,
            direction: 'down',
            isMoving: false,
            profile: data.profile
          }
        });
      });

      // Handle player leaving
      this.socket.on('playerLeft', (data: { id: string }) => {
        console.log(`[NetworkManager] Player left: ${data.id}`);
        this.notifyHandlers({
          type: 'player-leave',
          data,
        });
      });

      // Handle errors
      this.socket.on('error', (err: { message: string }) => {
        console.error('[NetworkManager] Error:', err.message);
      });

      console.log(`[NetworkManager] Joined room: ${this.roomId} as ${this.userName}`);
    } catch (error) {
      console.error('[NetworkManager] Failed to connect:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    console.log(`[NetworkManager] Disconnected from room: ${this.roomId}`);
  }

  updateProfile(profile: ProfileData) {
    this.userProfile = profile;
    this.userName = profile.username;
    
    if (this.socket?.connected) {
      this.socket.emit('updateProfile', profile);
    }
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.push(handler);
  }

  private notifyHandlers(message: MultiplayerMessage) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  broadcastPlayerUpdate(playerData: Omit<PlayerData, 'id' | 'name' | 'image'>) {
    const now = Date.now();
    if (now - this.lastBroadcastTime < this.broadcastInterval) {
      return; // Throttle updates
    }
    this.lastBroadcastTime = now;

    if (this.socket?.connected) {
      this.socket.emit('move', {
        x: playerData.x,
        y: playerData.y,
        direction: playerData.direction,
        isMoving: playerData.isMoving,
      });
    }
  }

  broadcastObjectInteraction(objectId: string, action: string) {
    if (this.socket?.connected) {
      this.socket.emit('interact', { objectId, action });
    }
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }
}
