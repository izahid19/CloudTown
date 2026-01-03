// Multiplayer types for CloudTown

export interface PlayerData {
  id: string;
  name: string;
  image?: string;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  profile?: {
    username: string;
    about: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    github?: string;
  };
}

export interface PlayerUpdateMessage {
  type: 'player-update';
  data: PlayerData;
}

export interface PlayerJoinMessage {
  type: 'player-join';
  data: PlayerData;
}

export interface PlayerLeaveMessage {
  type: 'player-leave';
  data: { id: string };
}

export interface ObjectInteractionMessage {
  type: 'object-interaction';
  data: {
    playerId: string;
    objectId: string;
    action: string;
  };
}

export interface SelfProfileMessage {
  type: 'self-profile-update';
  data: {
    username: string;
    about: string;
    linkedin?: string;
    twitter?: string;
    portfolio?: string;
    github?: string;
  };
}

export type MultiplayerMessage =
  | PlayerUpdateMessage
  | PlayerJoinMessage
  | PlayerLeaveMessage
  | ObjectInteractionMessage
  | SelfProfileMessage;
