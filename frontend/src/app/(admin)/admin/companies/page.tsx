"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { JobCardSkeleton } from "@/components/ui/Skeleton";
import { PageLoader } from "@/components/ui/Spinner";
import { approveCompany, getAdminCompanies } from "@/lib/api/admin";
import type { Company } from "@/types/company";
import { getErrorMessage } from "@/lib/utils";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("pending");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchCompanies = () => {
    setIsLoading(true);
    getAdminCompanies(filter === "all" ? undefined : filter)
      .then(setCompanies)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchCompanies(); }, [filter]);

  const handleApprove = async (id: string, approvalStatus: "approved" | "rejected") => {
    setActionId(id);
    setError("");
    try {
      await approveCompany(id, approvalStatus);
      fetchCompanies();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold">Companies</h1>
      <p className="mt-2 text-muted">Review and approve company registrations</p>
      <div className="mt-4 flex gap-2">
        {["pending", "approved", "rejected", "all"].map((f) => (
          <Button key={f} variant={filter === f ? "primary" : "outline"} size="sm" onClick={() => setFilter(f)}>
            {f}
          </Button>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-danger-text">{error}</p>}
      {isLoading ? (
        <div className="mt-8 space-y-4">
          <JobCardSkeleton />
          <PageLoader message="Loading companies..." className="py-6" />
        </div>
      ) : companies.length === 0 ? (
        <p className="mt-8 text-muted">No companies found</p>
      ) : (
        <div className="mt-8">
          <Table>
            <TableHead>
              <TableHeader>Name</TableHeader>
              <TableHeader>Location</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableHead>
            <TableBody>
              {companies.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.location || "—"}</TableCell>
                  <TableCell><Badge variant={c.approvalStatus === "approved" ? "success" : "warning"}>{c.approvalStatus}</Badge></TableCell>
                  <TableCell>
                    {c.approvalStatus === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(c._id, "approved")}
                          isLoading={actionId === c._id}
                          loadingText="..."
                          disabled={!!actionId}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(c._id, "rejected")}
                          disabled={!!actionId}
                        >
                          Reject
                        </Button>
                      </div>
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
