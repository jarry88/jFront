import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Globe,
  Send,
  Eye,
  Plus,
  Filter,
  Calendar,
  Bell,
  Mail,
  MapPin,
} from "lucide-react";

const CustomerPortManagement = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [filterPort, setFilterPort] = useState("");

  const customers = [
    {
      id: "CRM001",
      company: "Global Trading Corp",
      contact: "Sarah Chen",
      email: "sarah.chen@globaltrading.com",
      portPairs: ["Shanghai → Los Angeles", "Ningbo → Long Beach"],
      subscribedRoutes: 5,
      lastUpdate: "2025-01-20",
      frequency: "Weekly",
      status: "Active",
      preferences: ["Electronics", "Temperature Controlled"],
    },
    {
      id: "CRM002",
      company: "European Distributors",
      contact: "Klaus Mueller",
      email: "k.mueller@eudistrib.de",
      portPairs: ["Hamburg → New York", "Rotterdam → Norfolk"],
      subscribedRoutes: 3,
      lastUpdate: "2025-01-18",
      frequency: "Bi-weekly",
      status: "Active",
      preferences: ["Automotive", "Machinery"],
    },
    {
      id: "CRM003",
      company: "Asia Pacific Imports",
      contact: "Yuki Tanaka",
      email: "y.tanaka@apimports.jp",
      portPairs: ["Yokohama → Seattle", "Kobe → Tacoma"],
      subscribedRoutes: 7,
      lastUpdate: "2025-01-22",
      frequency: "Daily",
      status: "Active",
      preferences: ["Consumer Goods", "Food & Beverage"],
    },
    {
      id: "CRM004",
      company: "Mediterranean Logistics",
      contact: "Marco Rossi",
      email: "m.rossi@medlog.it",
      portPairs: ["Genoa → Savannah", "La Spezia → Charleston"],
      subscribedRoutes: 4,
      lastUpdate: "2025-01-15",
      frequency: "Weekly",
      status: "Pending",
      preferences: ["Fashion", "Textiles"],
    },
  ];

  const portPairTemplates = [
    {
      name: "Asia to US West Coast",
      routes: [
        "Shanghai → Los Angeles",
        "Ningbo → Long Beach",
        "Yantian → Oakland",
      ],
      customers: 12,
      avgVolume: "450 TEU/month",
    },
    {
      name: "Europe to US East Coast",
      routes: [
        "Hamburg → New York",
        "Rotterdam → Norfolk",
        "Antwerp → Charleston",
      ],
      customers: 8,
      avgVolume: "320 TEU/month",
    },
    {
      name: "Intra-Asia Routes",
      routes: ["Shanghai → Singapore", "Busan → Hong Kong", "Tokyo → Manila"],
      customers: 15,
      avgVolume: "680 TEU/month",
    },
  ];

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      filterPort === "" ||
      customer.portPairs.some((pair) =>
        pair.toLowerCase().includes(filterPort.toLowerCase()),
      ),
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Customer Port Management
          </h3>
          <p className="text-sm text-slate-600">
            Manage subscriptions and create targeted campaigns
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </Button>
          <Button variant="outline" size="sm" className="space-x-2">
            <Bell className="w-4 h-4" />
            <span>Reminders</span>
          </Button>
        </div>
      </div>

      {/* Port Pair Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span>Port Pair Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {portPairTemplates.map((template, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-slate-800">
                    {template.name}
                  </h4>
                  <Badge variant="outline">
                    {template.customers} customers
                  </Badge>
                </div>
                <div className="space-y-1 mb-3">
                  {template.routes.map((route, i) => (
                    <div
                      key={i}
                      className="text-xs text-slate-600 flex items-center space-x-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>{route}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Avg: {template.avgVolume}</span>
                  <Button variant="ghost" size="sm" className="h-6 p-0">
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Selection and Filtering */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Customer Subscriptions</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Filter by port..."
                value={filterPort}
                onChange={(e) => setFilterPort(e.target.value)}
                className="w-40"
              />
              <Button variant="outline" size="sm" className="space-x-2">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center space-x-4 p-3 border border-slate-200 rounded-lg"
              >
                <Checkbox
                  checked={selectedCustomers.includes(customer.id)}
                  onCheckedChange={() => handleCustomerSelect(customer.id)}
                />

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-slate-800">
                        {customer.company}
                      </h4>
                      <Badge
                        variant="secondary"
                        className={getStatusColor(customer.status)}
                      >
                        {customer.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-500">
                      {customer.subscribedRoutes} routes • {customer.frequency}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <span>{customer.contact}</span>
                    <span>•</span>
                    <span className="text-blue-600">{customer.email}</span>
                    <span>•</span>
                    <span>Last: {customer.lastUpdate}</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-slate-500">
                        Port Pairs:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {customer.portPairs.map((pair, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {pair}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {customer.preferences.map((pref, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="text-xs bg-blue-100 text-blue-800"
                        >
                          {pref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {selectedCustomers.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800">
                    {selectedCustomers.length} customers selected
                  </h4>
                  <p className="text-sm text-blue-600">
                    Create targeted campaigns or manage subscriptions
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Template</span>
                  </Button>
                  <Button size="sm" className="space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Campaign</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Reminder Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-5 h-5" />
            <span>Reminder Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">
                    Weekly Rate Updates
                  </h4>
                  <p className="text-sm text-slate-600">
                    Send rate updates every Monday
                  </p>
                </div>
                <Checkbox defaultChecked />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">
                    Bi-weekly Market Reports
                  </h4>
                  <p className="text-sm text-slate-600">
                    Comprehensive market analysis
                  </p>
                </div>
                <Checkbox defaultChecked />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">
                    Customer Follow-ups
                  </h4>
                  <p className="text-sm text-slate-600">
                    Automated follow-up reminders
                  </p>
                </div>
                <Checkbox />
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-slate-800">
                    Template Updates
                  </h4>
                  <p className="text-sm text-slate-600">
                    Refresh templates monthly
                  </p>
                </div>
                <Checkbox defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerPortManagement;
