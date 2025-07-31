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
import { ApiClient, type User, type UserListParams } from "@/lib/api";
import { Plus, Search, UserCheck, UserX, Edit, Trash2, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";

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
    { value: "", label: "所有角色" },
    { value: "admin", label: "管理员" },
    { value: "sales_manager", label: "销售经理" },
    { value: "sales_rep", label: "销售代表" },
    { value: "operations", label: "运营" },
    { value: "customer_service", label: "客服" },
    { value: "finance", label: "财务" },
    { value: "user", label: "普通用户" },
  ];

  // 状态选项
  const statusOptions = [
    { value: "", label: "所有状态" },
    { value: "true", label: "启用" },
    { value: "false", label: "禁用" },
  ];

  // 获取用户列表
  const fetchUsers = async (params: UserListParams = filters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const response = await ApiClient.getUsers(params);
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
        error: error instanceof Error ? error.message : "获取用户列表失败",
      }));
      toast.error("获取用户列表失败");
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
    const newFilters = { ...filters, role: role || undefined, page: 1 };
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
    try {
      setActionLoading(user.id);
      await ApiClient.toggleUserStatus(user.id, !user.is_active);
      toast.success(`用户已${user.is_active ? '禁用' : '启用'}`);
      fetchUsers(); // 刷新列表
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast.error("操作失败");
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
      toast.success("用户已删除");
      setDeleteDialog({ open: false, user: null });
      fetchUsers(); // 刷新列表
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("删除失败");
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
        title="用户管理"
        description="管理系统用户账户"
        breadcrumbs={[
          { label: "系统管理" },
          { label: "用户管理" },
        ]}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => fetchUsers()}
              disabled={state.loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
            <Button onClick={() => navigate("/admin/users/new")}>
              <Plus className="w-4 h-4 mr-2" />
              添加用户
            </Button>
          </>
        }
      />

      <div className="flex-1 p-6 space-y-6">

      {/* 筛选和搜索 */}
      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索用户名、邮箱、姓名..."
                  value={filters.search || ""}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.role || ""} onValueChange={handleRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="选择角色" />
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
              value={filters.is_active === undefined ? "" : filters.is_active.toString()} 
              onValueChange={handleStatusFilter}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="状态" />
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
            用户列表 
            {state.total > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                共 {state.total} 个用户
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
              没有找到用户
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户名</TableHead>
                    <TableHead>姓名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
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
                            {user.is_active ? "启用" : "禁用"}
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
                            onClick={() => navigate(`/admin/users/${user.id}/edit`)}
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
                    显示第 {(state.page - 1) * state.size + 1} - {Math.min(state.page * state.size, state.total)} 条，
                    共 {state.total} 条记录
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(state.page - 1)}
                      disabled={state.page <= 1}
                    >
                      上一页
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
                      下一页
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
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除用户 "{deleteDialog.user?.username}" 吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, user: null })}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={actionLoading === deleteDialog.user?.id}
            >
              {actionLoading === deleteDialog.user?.id ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default UserList;