import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { ApiClient, type RoleCreate, type RoleUpdate } from "@/lib/api";
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";

// 表单验证schema
const roleFormSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters.").max(50, "Role name must be at most 50 characters."),
  description: z.string().max(200, "Description must be at most 200 characters.").optional().or(z.literal("")),
});

type RoleFormData = z.infer<typeof roleFormSchema>;

const RoleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 加载角色数据（编辑模式）
  useEffect(() => {
    if (isEditing && id) {
      loadRole(parseInt(id));
    }
  }, [isEditing, id]);

  const loadRole = async (roleId: number) => {
    try {
      setInitialLoading(true);
      const role = await ApiClient.getRoleById(roleId);

      form.reset({
        name: role.name,
        description: role.description,
      });
    } catch (error) {
      console.error("Failed to load role:", error);
      toast.error("Failed to load role data.");
      navigate("/admin/roles");
    } finally {
      setInitialLoading(false);
    }
  };

  // 提交表单
  const onSubmit = async (data: RoleFormData) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        // 编辑角色
        const updateData: RoleUpdate = {
          name: data.name,
          description: data.description,
        };
        await ApiClient.updateRole(parseInt(id), updateData);
        toast.success("Role updated successfully.");
      } else {
        // 新增角色
        const createData: RoleCreate = {
          name: data.name,
          description: data.description,
        };
        await ApiClient.createRole(createData);
        toast.success("Role created successfully.");
      }

      navigate("/admin/roles");
    } catch (error) {
      console.error("Failed to save role:", error);
      toast.error(isEditing ? "Failed to update role." : "Failed to create role.");
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
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <DashboardHeader />
      <PageHeader
        title={isEditing ? "Edit Role" : "Add Role"}
        description={isEditing ? "Modify role information." : "Create a new user role."}
        breadcrumbs={[
          { label: "System Administration" },
          { label: "Role Management", href: "/admin/roles" },
          { label: isEditing ? "Edit Role" : "Add Role" },
        ]}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/roles")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{isEditing ? "Role Information" : "New Role Information"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 角色名称 */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter role name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 角色描述 */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter role description" rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 提交按钮 */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/roles")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        {isEditing ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? "Update Role" : "Create Role"}
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

export default RoleForm;