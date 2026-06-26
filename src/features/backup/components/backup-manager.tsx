"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useBackups } from "../hooks";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Download, Upload, Trash2, RefreshCw } from "lucide-react";

export function BackupManager() {
  const t = useTranslations("settings");
  const {
    backups,
    isLoading,
    createBackup,
    restoreBackup,
    deleteBackup,
    isCreating,
    isRestoring,
    isDeleting,
  } = useBackups();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleCreate = async () => {
    setMessage(null);
    const result = await createBackup();
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  const handleRestore = async (filename: string) => {
    if (!confirm(t("confirmRestore"))) return;
    setMessage(null);
    const result = await restoreBackup(filename);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.success
        ? t("restoreSuccess")
        : result.message,
    });
    if (result.success) {
      setTimeout(() => window.location.reload(), 2000);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(t("confirmDeleteBackup"))) return;
    setMessage(null);
    const result = await deleteBackup(filename);
    setMessage({
      type: result.success ? "success" : "error",
      text: result.message,
    });
  };

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleString();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("backup")}</CardTitle>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {t("createBackup")}
          </Button>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`mb-4 rounded-lg p-3 text-sm ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : backups.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              {t("noBackups")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("filename")}</TableHead>
                  <TableHead>{t("size")}</TableHead>
                  <TableHead>{t("date")}</TableHead>
                  <TableHead className="w-[120px]">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.filename}>
                    <TableCell className="font-mono text-xs">
                      {backup.filename}
                    </TableCell>
                    <TableCell>{formatSize(backup.size)}</TableCell>
                    <TableCell>{formatDate(backup.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRestore(backup.filename)}
                          disabled={isRestoring}
                          title={t("restore")}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(backup.filename)}
                          disabled={isDeleting}
                          title={t("delete")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
