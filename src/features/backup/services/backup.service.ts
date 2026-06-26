import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { BACKUP_DIR, DB_FILE, type BackupInfo, type BackupResult } from "../types";

const dbPath = process.env.RETAILX_DB_PATH ? path.resolve(process.env.RETAILX_DB_PATH) : path.resolve(DB_FILE);
const backupDir = path.resolve(BACKUP_DIR);

export class BackupService {
  static async ensureBackupDir(): Promise<void> {
    await fs.mkdir(backupDir, { recursive: true });
  }

  static async create(): Promise<BackupResult> {
    try {
      await BackupService.ensureBackupDir();
      const now = new Date();
      const ts = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
      const filename = `retailx-${ts}.db`;
      const destPath = path.join(backupDir, filename);

      await fs.copyFile(dbPath, destPath);

      return {
        success: true,
        message: `Backup created: ${filename}`,
        filename,
      };
    } catch (error) {
      return {
        success: false,
        message: `Backup failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  static async list(): Promise<BackupInfo[]> {
    try {
      await BackupService.ensureBackupDir();
      const entries = await fs.readdir(backupDir);
      const files: BackupInfo[] = [];

      for (const entry of entries) {
        if (!entry.endsWith(".db")) continue;
        const fullPath = path.join(backupDir, entry);
        const stat = await fs.stat(fullPath);
        if (stat.isFile()) {
          files.push({
            filename: entry,
            size: stat.size,
            createdAt: stat.birthtime.toISOString(),
            path: fullPath,
          });
        }
      }

      files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return files;
    } catch (error) {
      return [];
    }
  }

  static async restore(filename: string): Promise<BackupResult> {
    try {
      const sourcePath = path.join(backupDir, filename);
      await fs.access(sourcePath);

      await fs.copyFile(sourcePath, dbPath);

      return {
        success: true,
        message: `Database restored from: ${filename}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Restore failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  static async delete(filename: string): Promise<BackupResult> {
    try {
      const filePath = path.join(backupDir, filename);
      await fs.unlink(filePath);
      return {
        success: true,
        message: `Backup deleted: ${filename}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Delete failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
