import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Ship, Users, DollarSign, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ApiClient, Shipment, ShipmentListParams } from "@/lib/api";
import RatesTable from "./tables/RatesTable";
import CRMTable from "./tables/CRMTable";
import ShipmentDetailNew from "@/pages/ShipmentDetailNew";

type TableViewType = "shipments" | "rates" | "crm";

const TableView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<TableViewType>("shipments");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Shipments state
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null);

  const navigationItems = [
    {
      id: "shipments" as TableViewType,
      label: "Shipments",
      icon: Ship,
      description: "Track containers and cargo",
    },
    {
      id: "rates" as TableViewType,
      label: "Rates",
      icon: DollarSign,
      description: "Freight rates and pricing",
    },
    {
      id: "crm" as TableViewType,
      label: "CRM",
      icon: Users,
      description: "Customer relationships",
    },
  ];

  // Load shipments function
  const loadShipments = async (params: ShipmentListParams = {}) => {
    try {
      setLoading(true);
      
      const queryParams: ShipmentListParams = {
        page: currentPage,
        size: pageSize,
        ...params,
      };
      
      if (searchQuery) queryParams.search = searchQuery;
      
      const response = await ApiClient.getShipments(queryParams);
      
      setShipments(response.items);
      setTotalPages(response.pages);
      setTotalCount(response.total);
      
    } catch (error) {
      console.error("Error loading shipments:", error);
      toast({
        title: "Error",
        description: "Unable to load shipment list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load shipments when component mounts or params change
  useEffect(() => {
    if (currentView === "shipments") {
      loadShipments();
    }
  }, [currentView, currentPage, pageSize]);

  // Search handling
  const handleSearch = () => {
    if (currentView === "shipments") {
      setCurrentPage(1);
      loadShipments();
    }
  };

  // Mock data functions for shipments
  const getCompanyName = (companyId: number) => {
    const companies = {
      1: "Global Trading Corp",
      2: "Pacific Exports Ltd", 
      3: "European Distributors",
      4: "Hamburg Traders GmbH",
      5: "West Coast Imports",
      6: "Rotterdam Export Hub",
      7: "Asian Trade Partners",
      8: "Mediterranean Shipping Co"
    };
    return companies[companyId as keyof typeof companies] || `Company #${companyId}`;
  };

  const getPortName = (portId: number) => {
    const ports = {
      1: "Los Angeles, CA",
      2: "Shanghai, China", 
      3: "Hamburg, Germany",
      4: "New York, NY",
      5: "Rotterdam, Netherlands",
      6: "Long Beach, CA",
      7: "Le Havre, France",
      8: "Singapore"
    };
    return ports[portId as keyof typeof ports] || `Port #${portId}`;
  };

  const getCarrierName = (carrierId: number) => {
    const carriers = {
      1: "Maersk Line",
      2: "COSCO Shipping",
      3: "Evergreen Marine", 
      4: "CMA CGM"
    };
    return carriers[carrierId as keyof typeof carriers] || `Carrier #${carrierId}`;
  };

  const getStatusBadge = (statusId: number) => {
    switch (statusId) {
      case 17:
        return <Badge className="bg-blue-100 text-blue-800 border-0">In Transit</Badge>;
      case 20:
        return <Badge className="bg-green-100 text-green-800 border-0">Delivered</Badge>;
      case 19:
        return <Badge className="bg-purple-100 text-purple-800 border-0">Customs Clearance</Badge>;
      case 18:
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Loading</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-0">Unknown</Badge>;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit"
    });
  };

  const calculateRate = (shipmentId: number) => {
    const rates = ["$3,200", "$2,850", "$4,350", "$3,750"];
    return rates[(shipmentId - 1) % rates.length];
  };

  const renderShipmentsContent = () => {
    return (
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Shipment Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b">
                  <TableHead className="font-semibold text-gray-700">Shipment ID</TableHead>
                  <TableHead className="font-semibold text-gray-700">Container #</TableHead>
                  <TableHead className="font-semibold text-gray-700">Consignee</TableHead>
                  <TableHead className="font-semibold text-gray-700">Shipper</TableHead>
                  <TableHead className="font-semibold text-gray-700">POL → POD</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Carrier</TableHead>
                  <TableHead className="font-semibold text-gray-700">Container Type</TableHead>
                  <TableHead className="font-semibold text-gray-700">Rate</TableHead>
                  <TableHead className="font-semibold text-gray-700">ETA</TableHead>
                  <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.map((shipment) => (
                    <TableRow key={shipment.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-blue-600">
                        {shipment.shipment_number}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {shipment.awb_bol_number}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{getCompanyName(shipment.consignee_company_id)}</span>
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span>{getCompanyName(shipment.shipper_company_id)}</span>
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{getPortName(shipment.origin_port_id)}</div>
                          <div className="text-xs text-gray-500">↓</div>
                          <div className="text-sm">{getPortName(shipment.destination_port_id)}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(shipment.current_status_id)}
                      </TableCell>
                      <TableCell>
                        {getCarrierName(shipment.carrier_company_id)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {shipment.container_size_type_id === 1 ? "40ft HC" : 
                           shipment.container_size_type_id === 2 ? "20ft" : 
                           shipment.container_size_type_id === 3 ? "40ft" : "40ft"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="font-semibold text-green-600">
                            {calculateRate(shipment.id)}
                          </span>
                          <ExternalLink className="w-3 h-3 text-blue-500" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(shipment.arrival_date)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedShipmentId(shipment.id)}
                          className="text-blue-600 border-blue-600 hover:bg-blue-50"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Footer with pagination info */}
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  Showing {((currentPage - 1) * pageSize) + 1} of {totalCount} shipments
                </div>
                <div className="flex items-center space-x-4">
                  <span>ETD: Estimated Time of Departure</span>
                  <span>ETA: Estimated Time of Arrival</span>
                  <span>POL: Port of Loading</span>
                  <span>POD: Port of Discharge</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTableContent = () => {
    // if (currentView === "shipments" && selectedShipmentId) {
    //   return (
    //     <ShipmentDetailNew
    //       shipmentId={selectedShipmentId}
    //       onBack={() => setSelectedShipmentId(null)}
    //     />
    //   );
    // }
    switch (currentView) {
      case "rates":
        return <RatesTable searchQuery={searchQuery} />;
      case "crm":
        return <CRMTable searchQuery={searchQuery} />;
      case "shipments":
        return renderShipmentsContent();
      default:
        return renderShipmentsContent();
    }
  };

  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Data Management</h1>
        <div className="flex items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`space-x-2 ${isActive ? "bg-primary text-primary-foreground" : "text-gray-600 hover:text-gray-900"}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {renderTableContent()}
    </div>
  );
};

export default TableView;
