import { Button } from "@/components/ui/button";
import { ChevronRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const PageHeader = ({ title, description, breadcrumbs = [], actions }: PageHeaderProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" },
    ...breadcrumbs,
  ];

  return (
    <div className="border-b bg-white px-6 py-4">
      {/* Breadcrumbs */}
      {defaultBreadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-muted-foreground hover:text-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="w-4 h-4" />
          </Button>
          {defaultBreadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              {item.href && index < defaultBreadcrumbs.length - 1 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => navigate(item.href!)}
                >
                  {item.label}
                </Button>
              ) : (
                <span className={index === defaultBreadcrumbs.length - 1 ? "text-foreground font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header content */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;