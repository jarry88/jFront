import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ApiClient, type User, type UserListParams, type UserListResponse } from "@/lib/api"; // 新增 UserListResponse
import { Plus, Search, Edit, Trash2, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";
import { format } from "date-fns";

interface UserListState {
  users: User[];
  total: number;
  page: number;
  size: number;
  pages: number;
  loading: boolean;
  error: string | null;
}

const UserList = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<UserListState>({
    users: [],
    total: 0,
    page: 1,
    size: 10,
    pages: 0,
    loading: true,
    error: null,
  });

  const [filters, setFilters] = useState<UserListParams>({
    page: 1,
    size: 10,
    search: "",
    role: "",
    is_active: undefined,
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    user: User | null;
  }>({
    open: false,
    user: null,
  });

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // 用户角色选项
  const roleOptions = [
    { value: "all", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "sales_rep", label: "Sales Rep" },
    { value: "operations", label: "Operations" },
    { value: "customer_service", label: "Customer Service" },
    { value: "finance", label: "Finance" },
    { value: "user", label: "User" },
  ];

  // 状态选项
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  // 获取用户列表
  const fetchUsers = async (params: UserListParams = filters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response: UserListResponse = await ApiClient.getUsers(params);

      setState(prev => ({
        ...prev,
        users: response.items,
        total: response.total,
        page: response.page,
        size: response.size,
        pages: response.pages,
        loading: false,
      }));
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user list",
      }));
      toast.error("Failed to fetch user list");
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
  }, []);

  // 搜索处理
  const handleSearch = (value: string) => {
    const newFilters = { ...filters, search: value, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // 角色筛选
  const handleRoleFilter = (role: string) => {
    const newFilters = { ...filters, role: role === "all" ? undefined : role, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // 状态筛选
  const handleStatusFilter = (status: string) => {
    let is_active: boolean | undefined;
    if (status === "true") is_active = true;
    else if (status === "false") is_active = false;
    else is_active = undefined;

    const newFilters = { ...filters, is_active, page: 1 };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // 分页处理
  const handlePageChange = (newPage: number) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  // 切换用户状态
  const handleToggleUserStatus = async (user: User) => {
    const newStatus = !user.is_active;
    try {
      setActionLoading(user.id);
      await ApiClient.updateUser(user.id, { is_active: newStatus });
      toast.success(`User ${user.username} is now ${newStatus ? 'active' : 'inactive'}`);
      fetchUsers(); // 刷新列表
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("Failed to toggle user status");
    } finally {
      setActionLoading(null);
    }
  };

  // 删除用户
  const handleDeleteUser = async () => {
    if (!deleteDialog.user) return;

    try {
      setActionLoading(deleteDialog.user.id);
      await ApiClient.deleteUser(deleteDialog.user.id);
      toast.success("User has been deleted");
      setDeleteDialog({ open: false, user: null });
      fetchUsers(); // 刷新列表
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    const roleOption = roleOptions.find(option => option.value === role);
    return roleOption?.label || role;
  };

  // 格式化日期
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
        title="User Management"
        description="Manage system user accounts and permissions."
        breadcrumbs={[
          { label: "System Administration" },
          { label: "User Management" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => fetchUsers()}
              disabled={state.loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => navigate("/admin/users/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </>
        }
      />

      <div className="flex-1 p-6 space-y-6">

        {/* 筛选和搜索 */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by username, email, name..."
                    value={filters.search || ""}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filters.role || "all"} onValueChange={handleRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.is_active === undefined ? "all" : filters.is_active.toString()}
                onValueChange={handleStatusFilter}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 用户列表 */}
        <Card>
          <CardHeader>
            <CardTitle>
              User List
              {state.total > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                ({state.total} users)
              </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {state.loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : state.error ? (
              <div className="text-center py-8 text-red-500">
                {state.error}
              </div>
            ) : state.users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No users found
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.first_name} {user.last_name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.is_active}
                              onCheckedChange={() => handleToggleUserStatus(user)}
                              disabled={actionLoading === user.id}
                            />
                            <Badge variant={user.is_active ? "default" : "secondary"}>
                              {user.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(user.last_login)}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/users/edit/${user.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, user })}
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

                {/* 分页 */}
                {state.pages > 1 && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {(state.page - 1) * state.size + 1} - {Math.min(state.page * state.size, state.total)} of {state.total} records
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(state.page - 1)}
                        disabled={state.page <= 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, state.pages) }, (_, i) => {
                          const pageNum = i + Math.max(1, state.page - 2);
                          if (pageNum > state.pages) return null;
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === state.page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(state.page + 1)}
                        disabled={state.page >= state.pages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* 删除确认对话框 */}
        <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, user: null })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete user "{deleteDialog.user?.username}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialog({ open: false, user: null })}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteUser}
                disabled={actionLoading === deleteDialog.user?.id}
              >
                {actionLoading === deleteDialog.user?.id ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserList;