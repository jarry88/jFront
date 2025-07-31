import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  DollarSign,
  Users,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ApiClient, Shipment, ShipmentListParams } from "@/lib/api";

const ShipmentList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load shipments
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

  // Initial load
  useEffect(() => {
    loadShipments();
  }, [currentPage, pageSize]);

  // Search handling
  const handleSearch = () => {
    setCurrentPage(1);
    loadShipments();
  };

  // Get status badge
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

  // Get company name mockup
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

  // Get port name mockup
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

  // Get carrier name mockup
  const getCarrierName = (carrierId: number) => {
    const carriers = {
      1: "Maersk Line",
      2: "COSCO Shipping",
      3: "Evergreen Marine", 
      4: "CMA CGM"
    };
    return carriers[carrierId as keyof typeof carriers] || `Carrier #${carrierId}`;
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit", 
      day: "2-digit"
    });
  };

  // Calculate rate mockup
  const calculateRate = (shipmentId: number) => {
    const rates = ["$3,200", "$2,850", "$4,350", "$3,750"];
    return rates[(shipmentId - 1) % rates.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
            <nav className="flex items-center space-x-6">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal">
                <DollarSign className="w-4 h-4 mr-1" />
                Rates
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal">
                <Users className="w-4 h-4 mr-1" />
                CRM
              </Button>
            </nav>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search shipments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300"
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
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
                          onClick={() => navigate(`/shipment/${shipment.id}`)}
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
    </div>
  );
};

export default ShipmentList; 