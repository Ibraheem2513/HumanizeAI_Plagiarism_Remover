export enum ProcessingStatus {
  IDLE = 'IDLE',
  READING_FILE = 'READING_FILE',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface RewrittenContent {
  original: string;
  humanized: string;
  stats: {
    words: number;
    detectionScore: number; // Simulated score
  };
}

export type FileType = 'text' | 'pdf' | 'docx';
