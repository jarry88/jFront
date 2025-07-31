import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ApiClient, type User, type UserCreate, type UserUpdate } from "@/lib/api";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";

// 表单验证schema
const userFormSchema = z.object({
  username: z.string().min(3, "用户名至少3个字符").max(50, "用户名最多50个字符"),
  email: z.string().email("请输入有效的邮箱地址"),
  first_name: z.string().min(1, "请输入名字").max(50, "名字最多50个字符"),
  last_name: z.string().min(1, "请输入姓氏").max(50, "姓氏最多50个字符"),
  role: z.string().min(1, "请选择角色"),
  company_id: z.number().nullable().optional(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  is_active: z.boolean().default(true),
}).refine((data) => {
  // 新建用户时密码必填
  if (!data.password && window.location.pathname.includes('/new')) {
    return false;
  }
  return true;
}, {
  message: "新建用户时密码不能为空",
  path: ["password"]
}).refine((data) => {
  // 如果设置了密码，确认密码必须匹配
  if (data.password && data.password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "两次输入的密码不一致",
  path: ["confirm_password"]
});

type UserFormData = z.infer<typeof userFormSchema>;

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  // 用户角色选项
  const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "sales_manager", label: "销售经理" },
    { value: "sales_rep", label: "销售代表" },
    { value: "operations", label: "运营" },
    { value: "customer_service", label: "客服" },
    { value: "finance", label: "财务" },
    { value: "user", label: "普通用户" },
  ];

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      email: "",
      first_name: "",
      last_name: "",
      role: "",
      company_id: null,
      password: "",
      confirm_password: "",
      is_active: true,
    },
  });

  // 加载用户数据（编辑模式）
  useEffect(() => {
    if (isEditing && id) {
      loadUser(parseInt(id));
    }
  }, [isEditing, id]);

  const loadUser = async (userId: number) => {
    try {
      setInitialLoading(true);
      const user = await ApiClient.getUserById(userId);
      
      // 填充表单数据
      form.reset({
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        company_id: user.company_id,
        password: "",
        confirm_password: "",
        is_active: user.is_active,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      toast.error("加载用户数据失败");
      navigate("/admin/users");
    } finally {
      setInitialLoading(false);
    }
  };

  // 提交表单
  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        // 编辑用户
        const updateData: UserUpdate = {
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          company_id: data.company_id,
          is_active: data.is_active,
        };

        // 只在设置了新密码时才更新密码
        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
        }

        await ApiClient.updateUser(parseInt(id), updateData);
        toast.success("用户更新成功");
      } else {
        // 新建用户
        const createData: UserCreate = {
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          company_id: data.company_id,
          password: data.password!,
          is_active: data.is_active,
        };

        await ApiClient.createUser(createData);
        toast.success("用户创建成功");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(isEditing ? "更新用户失败" : "创建用户失败");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 flex justify-center items-center">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardHeader />
      <PageHeader
        title={isEditing ? "编辑用户" : "添加用户"}
        description={isEditing ? "修改用户信息" : "创建新的用户账户"}
        breadcrumbs={[
          { label: "系统管理" },
          { label: "用户管理", href: "/admin/users" },
          { label: isEditing ? "编辑用户" : "添加用户" },
        ]}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回列表
          </Button>
        }
      />

      <div className="flex-1 p-6">

      {/* 表单 */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{isEditing ? "用户信息" : "新用户信息"}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入用户名" {...field} />
                      </FormControl>
                      <FormDescription>
                        用户登录时使用的用户名
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>邮箱 *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="请输入邮箱地址" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>名字 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入名字" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>姓氏 *</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入姓氏" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 角色选择 */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>角色 *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="请选择角色" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      用户在系统中的角色和权限
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 密码设置 */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">
                    {isEditing ? "密码设置（留空则不修改）" : "密码设置"}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          密码 {!isEditing && "*"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder={isEditing ? "留空则不修改密码" : "请输入密码"}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {isEditing ? "输入新密码来修改密码" : "用户登录密码"}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirm_password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          确认密码 {!isEditing && "*"}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="请再次输入密码"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 状态设置 */}
              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">账户状态</h3>
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">启用账户</FormLabel>
                        <FormDescription>
                          启用后用户可以正常登录和使用系统
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/users")}
                  disabled={loading}
                >
                  取消
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? "更新中..." : "创建中..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditing ? "更新用户" : "创建用户"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default UserForm;