import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  RefreshCw,
  Download,
  Star,
  Clock,
  DollarSign,
  Ship,
  Calendar,
  AlertTriangle,
} from "lucide-react";

const RateComparisonTool = () => {
  const [selectedOrigin, setSelectedOrigin] = useState("Shanghai");
  const [selectedDestination, setSelectedDestination] = useState("Hamburg");
  const [containerType, setContainerType] = useState("40ft");
  const [activeTab, setActiveTab] = useState("comparison");

  const rateData = [
    {
      carrier: "Maersk",
      logo: "MSK",
      rate: 4200,
      currency: "USD",
      type: "Contract",
      transitTime: 28,
      demurrage: 150,
      detention: 200,
      validity: "2025-03-31",
      lastUpdated: "2025-01-22",
      trend: "up",
      trendValue: 5.2,
      service: "AE7",
      frequency: "Weekly",
      reliability: 98.5,
      rating: 4.8,
    },
    {
      carrier: "CMA CGM",
      logo: "CMA",
      rate: 3950,
      currency: "USD",
      type: "Spot",
      transitTime: 32,
      demurrage: 140,
      detention: 180,
      validity: "2025-02-15",
      lastUpdated: "2025-01-21",
      trend: "down",
      trendValue: 2.1,
      service: "FAL1",
      frequency: "Weekly",
      reliability: 96.2,
      rating: 4.5,
    },
    {
      carrier: "ONE",
      logo: "ONE",
      rate: 4100,
      currency: "USD",
      type: "Contract",
      transitTime: 30,
      demurrage: 160,
      detention: 210,
      validity: "2025-04-30",
      lastUpdated: "2025-01-22",
      trend: "stable",
      trendValue: 0.8,
      service: "PS7",
      frequency: "Weekly",
      reliability: 97.1,
      rating: 4.6,
    },
    {
      carrier: "Hapag-Lloyd",
      logo: "HPL",
      rate: 4350,
      currency: "USD",
      type: "Contract",
      transitTime: 26,
      demurrage: 155,
      detention: 195,
      validity: "2025-03-15",
      lastUpdated: "2025-01-20",
      trend: "up",
      trendValue: 3.7,
      service: "FE2",
      frequency: "Weekly",
      reliability: 99.1,
      rating: 4.9,
    },
    {
      carrier: "COSCO",
      logo: "COS",
      rate: 3850,
      currency: "USD",
      type: "Spot",
      transitTime: 35,
      demurrage: 135,
      detention: 175,
      validity: "2025-02-28",
      lastUpdated: "2025-01-19",
      trend: "down",
      trendValue: 4.3,
      service: "CEM",
      frequency: "Bi-weekly",
      reliability: 94.8,
      rating: 4.2,
    },
  ];

  const marketTrends = [
    {
      route: "Shanghai → Hamburg",
      avgRate: 4090,
      change: 2.3,
      trend: "up",
      volume: "High",
      season: "Peak",
    },
    {
      route: "Shanghai → Rotterdam",
      avgRate: 3950,
      change: -1.2,
      trend: "down",
      volume: "Medium",
      season: "Normal",
    },
    {
      route: "Ningbo → Hamburg",
      avgRate: 4150,
      change: 3.1,
      trend: "up",
      volume: "High",
      season: "Peak",
    },
    {
      route: "Qingdao → Hamburg",
      avgRate: 4250,
      change: 1.8,
      trend: "up",
      volume: "Low",
      season: "Normal",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "down":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-slate-500";
    }
  };

  const getRateTypeColor = (type: string) => {
    return type === "Contract"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 98) return "text-green-600";
    if (reliability >= 95) return "text-yellow-600";
    return "text-red-600";
  };

  const ports = [
    "Shanghai",
    "Hamburg",
    "Rotterdam",
    "Los Angeles",
    "Long Beach",
    "Singapore",
    "Hong Kong",
    "Busan",
    "Tokyo",
    "New York",
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Rate Comparison Tool
          </h3>
          <p className="text-sm text-slate-600">
            Compare rates across multiple carriers with real-time data
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button variant="outline" size="sm" className="space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Origin
              </label>
              <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Destination
              </label>
              <Select
                value={selectedDestination}
                onValueChange={setSelectedDestination}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ports.map((port) => (
                    <SelectItem key={port} value={port}>
                      {port}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Container
              </label>
              <Select value={containerType} onValueChange={setContainerType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20ft">20ft Standard</SelectItem>
                  <SelectItem value="40ft">40ft Standard</SelectItem>
                  <SelectItem value="40ft-hc">40ft High Cube</SelectItem>
                  <SelectItem value="45ft">45ft High Cube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Compare</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparison" className="space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Rate Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Market Trends</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>
                  Rates: {selectedOrigin} → {selectedDestination}
                </span>
                <Badge variant="outline">{containerType} Container</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carrier</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Transit</TableHead>
                      <TableHead>Demurrage</TableHead>
                      <TableHead>Detention</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Trend</TableHead>
                      <TableHead>Reliability</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rateData.map((rate) => (
                      <TableRow
                        key={rate.carrier}
                        className="hover:bg-slate-50"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center">
                              <span className="text-xs font-bold">
                                {rate.logo}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{rate.carrier}</div>
                              <div className="text-xs text-slate-500">
                                {rate.service}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {rate.currency} {rate.rate.toLocaleString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            {rate.frequency}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getRateTypeColor(rate.type)}
                          >
                            {rate.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{rate.transitTime} days</span>
                          </div>
                        </TableCell>
                        <TableCell>${rate.demurrage}/day</TableCell>
                        <TableCell>${rate.detention}/day</TableCell>
                        <TableCell>
                          <div className="text-sm">{rate.validity}</div>
                          <div className="text-xs text-slate-500">
                            Updated: {rate.lastUpdated}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            {getTrendIcon(rate.trend)}
                            <span
                              className={`text-sm ${getTrendColor(rate.trend)}`}
                            >
                              {rate.trendValue}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-medium ${getReliabilityColor(rate.reliability)}`}
                          >
                            {rate.reliability}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">
                              {rate.rating}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Route Performance
                  </h4>
                  <div className="space-y-3">
                    {marketTrends.map((trend, index) => (
                      <div
                        key={index}
                        className="p-3 border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium">{trend.route}</h5>
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(trend.trend)}
                            <span
                              className={`text-sm font-medium ${getTrendColor(trend.trend)}`}
                            >
                              {trend.change}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>Avg: ${trend.avgRate.toLocaleString()}</span>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="text-xs">
                              {trend.volume} Volume
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {trend.season}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Market Insights
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <h5 className="font-medium text-blue-800">
                          Rate Increase Alert
                        </h5>
                      </div>
                      <p className="text-sm text-blue-700">
                        Asia to Europe rates trending upward due to increased
                        demand and capacity constraints.
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <h5 className="font-medium text-yellow-800">
                          Capacity Warning
                        </h5>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Limited space availability on premium services. Book
                        early for Q2 shipments.
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Ship className="w-4 h-4 text-green-600" />
                        <h5 className="font-medium text-green-800">
                          New Service Launch
                        </h5>
                      </div>
                      <p className="text-sm text-green-700">
                        Hapag-Lloyd launching new direct service offering 26-day
                        transit times.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">$4,090</div>
                    <div className="text-sm text-slate-600">Average Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">29.4</div>
                    <div className="text-sm text-slate-600">
                      Avg Transit (days)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">97.1%</div>
                    <div className="text-sm text-slate-600">
                      Avg Reliability
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-slate-600 py-8">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <p>
                  Detailed cost breakdown charts and analytics will be displayed
                  here.
                </p>
                <p className="text-sm">
                  Interactive charts showing rate trends, cost components, and
                  forecasts.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RateComparisonTool;
