"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { deactivateUser, getAdminUsers } from "@/lib/api/admin";
import type { User } from "@/types/user";
import { getErrorMessage } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [roleFilter, setRoleFilter] = useState("candidate");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = () => {
    setIsLoading(true);
    getAdminUsers(roleFilter)
      .then((data) => setUsers(data.results))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const handleDeactivate = async (id: string) => {
    if (!confirm("Deactivate this user? They will no longer be able to access the platform.")) return;
    setActionId(id);
    setError("");
    try {
      await deactivateUser(id);
      fetchUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Users</h1>
      <p className="mt-2 text-muted">Manage platform users</p>
      <div className="mt-4 flex gap-2">
        {["candidate", "recruiter", "admin"].map((r) => (
          <Button key={r} variant={roleFilter === r ? "primary" : "outline"} size="sm" onClick={() => setRoleFilter(r)}>
            {r}
          </Button>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}
      {isLoading ? (
        <div className="mt-8 space-y-4">
          <JobCardSkeleton />
          <PageLoader message="Loading users..." className="py-6" />
        </div>
      ) : users.length === 0 ? (
        <p className="mt-8 text-muted">No users found</p>
      ) : (
        <div className="mt-8">
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Role</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge>{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={u.isActive ? "success" : "danger"}>{u.isActive ? "active" : "inactive"}</Badge></TableCell>
                  <TableCell>
                    {u.isActive && u.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeactivate(u._id)}
                        isLoading={actionId === u._id}
                        loadingText="..."
                        disabled={!!actionId}
                      >
                        Deactivate
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
