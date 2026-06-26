"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useUsers } from "../hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, UserX, UserCheck } from "lucide-react";

export function UserManagement() {
  const t = useTranslations("settings");
  const { users, isLoading, createUser, toggleActive, isCreating } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await createUser({ name, email, role });
    setName("");
    setEmail("");
    setRole("staff");
    setShowForm(false);
  }

  const handleToggleActive = async (id: number) => {
    if (confirm(t("confirmToggleActive"))) {
      await toggleActive(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t("users")}</CardTitle>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          <Plus className="h-4 w-4" />
          {t("addUser")}
        </Button>
      </CardHeader>
      <CardContent>
        {showForm && (
          <div className="mb-6 rounded-lg border p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("name")}</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("email")}</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("role")}</label>
                  <Select value={role} onValueChange={(v) => v && setRole(v as "admin" | "staff")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{t("admin")}</SelectItem>
                      <SelectItem value="staff">{t("staff")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {t("save")}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  {t("cancel")}
                </Button>
              </div>
            </form>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {t("noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                      {user.role === "admin" ? t("admin") : t("staff")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "outline" : "destructive"}>
                      {user.isActive ? t("active") : t("inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(user.id)}
                      title={t("toggleActive")}
                    >
                      {user.isActive ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
