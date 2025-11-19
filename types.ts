export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Attachment {
  mimeType: string;
  data: string; // Base64 string
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isThinking?: boolean;
  attachment?: Attachment;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export type ThemeColor = 'blue' | 'purple' | 'green' | 'orange';

export type VisualTheme = 'pastel' | 'nexus' | 'zen' | 'neon';