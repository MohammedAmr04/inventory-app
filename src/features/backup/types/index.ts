export interface BackupInfo {
  filename: string;
  size: number;
  createdAt: string;
  path: string;
}

export interface BackupResult {
  success: boolean;
  message: string;
  filename?: string;
}

export const BACKUP_DIR = "app_data/backups";
export const DB_FILE = "retailx.db";
