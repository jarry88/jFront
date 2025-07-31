import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { ApiClient, type RoleInfo } from "@/lib/api";
import { Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";
import { format } from "date-fns";

interface RoleListState {
  roles: RoleInfo[];
  loading: boolean;
  error: string | null;
}

const RoleList = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<RoleListState>({
    roles: [],
    loading: true,
    error: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    role: RoleInfo | null;
  }>({
    open: false,
    role: null,
  });

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchRoles = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await ApiClient.getRoles();
      setState(prev => ({
        ...prev,
        roles: response,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch role list",
      }));
      toast.error("Failed to fetch role list");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDeleteRole = async () => {
    if (!deleteDialog.role) return;

    try {
      setActionLoading(deleteDialog.role.id);
      await ApiClient.deleteRole(deleteDialog.role.id);
      toast.success("Role has been deleted");
      setDeleteDialog({ open: false, role: null });
      fetchRoles(); // 刷新列表
    } catch (error) {
      console.error("Failed to delete role:", error);
      toast.error("Failed to delete role");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardHeader />
      <PageHeader
        title="Role Management"
        description="Manage user roles and permissions in the system."
        breadcrumbs={[
          { label: "System Administration" },
          { label: "Role Management" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => fetchRoles()}
              disabled={state.loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate("/admin/roles/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Role
            </Button>
          </>
        }
      />

      <div className="flex-1 p-6">
        <Card>
          <CardContent>
            {state.loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : state.error ? (
              <div className="text-center py-8 text-red-500">
                {state.error}
              </div>
            ) : state.roles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No roles found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.id}</TableCell>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>{role.description || "-"}</TableCell>
                      <TableCell>{formatDate(role.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/roles/edit/${role.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDialog({ open: true, role })}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
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

      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, role: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete role "{deleteDialog.role?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, role: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteRole}
              disabled={actionLoading === deleteDialog.role?.id}
            >
              {actionLoading === deleteDialog.role?.id ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleList;