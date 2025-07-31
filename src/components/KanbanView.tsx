import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const KanbanView = () => {
  const columns: Column[] = [
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Review Container MSKU7845123",
          description: "Check documentation and customs clearance status",
          priority: "high",
          assignee: "Newton Davis",
          dueDate: "2025-01-25",
        },
        {
          id: "2",
          title: "Update Shipping Rates",
          description: "Quarterly rate review for Asia-Pacific routes",
          priority: "medium",
          assignee: "Newton Davis",
          dueDate: "2025-01-30",
        },
      ],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "Process COSCO9876543 Delivery",
          description: "Coordinate final mile delivery in New York",
          priority: "high",
          assignee: "Newton Davis",
          dueDate: "2025-01-22",
        },
      ],
    },
    {
      id: "review",
      title: "Under Review",
      tasks: [
        {
          id: "4",
          title: "Client Invoice Verification",
          description: "Review billing for December shipments",
          priority: "low",
          assignee: "Newton Davis",
          dueDate: "2025-01-28",
        },
      ],
    },
    {
      id: "done",
      title: "Completed",
      tasks: [
        {
          id: "5",
          title: "Hamburg Route Documentation",
          description: "Complete export documentation for EU compliance",
          priority: "medium",
          assignee: "Newton Davis",
          dueDate: "2025-01-20",
        },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "border-t-slate-400";
      case "in-progress":
        return "border-t-blue-400";
      case "review":
        return "border-t-orange-400";
      case "done":
        return "border-t-green-400";
      default:
        return "border-t-slate-400";
    }
  };

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Task Management
        </h2>
        <p className="text-slate-600">
          Organize and track your freight operations tasks
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-0">
        {columns.map((column) => (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-slate-700">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3 flex-1">
              {column.tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-t-4 ${getColumnColor(column.id)} hover:shadow-md transition-shadow cursor-pointer`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm font-medium line-clamp-2">
                        {task.title}
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <Badge
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                        variant="secondary"
                      >
                        {task.priority}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      Assigned to: {task.assignee}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanView;
