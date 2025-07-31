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
import { ApiClient, type User, type UserCreate, type UserUpdate, type RoleInfo } from "@/lib/api"; // 新增 RoleInfo
import { ArrowLeft, Save, RefreshCw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import DashboardHeader from "@/components/DashboardHeader";

// 表单验证schema
const userFormSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(50, "Username must be at most 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  first_name: z.string().min(1, "Please enter first name.").max(50, "First name must be at most 50 characters."),
  last_name: z.string().min(1, "Please enter last name.").max(50, "Last name must be at most 50 characters."),
  role: z.string().min(1, "Please select a role."),
  company_id: z.number().nullable().optional(),
  password: z.string().optional(),
  confirm_password: z.string().optional(),
  is_active: z.boolean().default(true),
}).refine((data) => {
  // 密码在新建模式下是必填项
  const isCreating = window.location.pathname.includes('/new');
  if (isCreating && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required for new users.",
  path: ["password"]
}).refine((data) => {
  // 如果设置了密码，确认密码必须匹配
  if (data.password && data.password !== data.confirm_password) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match.",
  path: ["confirm_password"]
});

type UserFormData = z.infer<typeof userFormSchema>;

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id && id !== 'new';

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [roles, setRoles] = useState<RoleInfo[]>([]);

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

  useEffect(() => {
    const loadData = async () => {
      setInitialLoading(true);
      try {
        const fetchedRoles = await ApiClient.getRoles();
        setRoles(fetchedRoles);

        if (isEditing && id) {
          const user = await ApiClient.getUserById(parseInt(id));
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
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Failed to load data, please try again.");
        navigate("/admin/users");
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [isEditing, id, navigate]);

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        const updateData: UserUpdate = {
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
          company_id: data.company_id,
          is_active: data.is_active,
        };

        if (data.password && data.password.length > 0) {
          updateData.password = data.password;
        }

        await ApiClient.updateUser(parseInt(id), updateData);
        toast.success("User updated successfully.");
      } else {
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
        toast.success("User created successfully.");
      }

      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to save user:", error);
      toast.error(isEditing ? "Failed to update user." : "Failed to create user.");
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
        title={isEditing ? "Edit User" : "Add User"}
        description={isEditing ? "Modify user information." : "Create a new user account."}
        breadcrumbs={[
          { label: "System Administration" },
          { label: "User Management", href: "/admin/users" },
          { label: isEditing ? "Edit User" : "Add User" },
        ]}
        actions={
          <Button
            variant="ghost"
            onClick={() => navigate("/admin/users")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
        }
      />

      <div className="flex-1 p-6">
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{isEditing ? "User Information" : "New User Information"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormDescription>
                          Username for logging in.
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter email address" {...field} />
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
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter first name" {...field} />
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
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={initialLoading}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {roles.length > 0 ? (
                            roles.map((role) => (
                              <SelectItem key={role.id} value={role.name}>
                                {role.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        User's role and permissions within the system.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">
                      Password Settings
                      {isEditing && <span className="text-sm font-normal text-muted-foreground ml-2">(Leave blank to keep current password)</span>}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Password {!isEditing && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {isEditing ? "Enter a new password to change it." : "User's login password."}
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
                            Confirm Password {!isEditing && "*"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Re-enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-medium mb-4">Account Status</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Activate Account</FormLabel>
                          <FormDescription>
                            When active, the user can log in and use the system.
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

                <div className="flex justify-end gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/users")}
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
                        {isEditing ? "Update User" : "Create User"}
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