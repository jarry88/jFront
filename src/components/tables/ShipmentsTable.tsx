import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ShipmentsTableProps {
  searchQuery: string;
}

const ShipmentsTable = ({ searchQuery }: ShipmentsTableProps) => {
  const navigate = useNavigate();
  // Sample shipments data with CRM and rate linkages
  const shipmentsData = [
    {
      id: "SH001",
      containerNumber: "MSKU7845123",
      consignee: "Global Trading Corp",
      consigneeId: "CRM001",
      shipper: "Pacific Exports Ltd",
      shipperId: "CRM005",
      portOfLoading: "Los Angeles, CA",
      portOfDischarge: "Shanghai, China",
      status: "In Transit",
      carrier: "Maersk Line",
      eta: "2025-01-25",
      etd: "2025-01-10",
      rateId: "RT001",
      baseRate: "$3,200",
      containerType: "40ft HC",
      bookingNumber: "MSK456789",
      blNumber: "MSKUBL123456",
    },
    {
      id: "SH002",
      containerNumber: "COSCO9876543",
      consignee: "European Distributors",
      consigneeId: "CRM002",
      shipper: "Hamburg Traders GmbH",
      shipperId: "CRM006",
      portOfLoading: "Hamburg, Germany",
      portOfDischarge: "New York, NY",
      status: "Delivered",
      carrier: "COSCO Shipping",
      eta: "2025-01-20",
      etd: "2024-12-28",
      rateId: "RT002",
      baseRate: "$2,850",
      containerType: "20ft",
      bookingNumber: "COS789123",
      blNumber: "COSBL987654",
    },
    {
      id: "SH003",
      containerNumber: "EVER1234567",
      consignee: "West Coast Imports",
      consigneeId: "CRM003",
      shipper: "Rotterdam Export Hub",
      shipperId: "CRM007",
      portOfLoading: "Rotterdam, Netherlands",
      portOfDischarge: "Long Beach, CA",
      status: "Loading",
      carrier: "Evergreen Marine",
      eta: "2025-01-30",
      etd: "2025-01-15",
      rateId: "RT003",
      baseRate: "$4,350",
      containerType: "40ft HC",
      bookingNumber: "EVR321654",
      blNumber: "EVRBL654321",
    },
    {
      id: "SH004",
      containerNumber: "CMAU5678901",
      consignee: "Asian Trade Partners",
      consigneeId: "CRM004",
      shipper: "Mediterranean Shipping Co",
      shipperId: "CRM008",
      portOfLoading: "Le Havre, France",
      portOfDischarge: "Singapore",
      status: "Customs Clearance",
      carrier: "CMA CGM",
      eta: "2025-01-28",
      etd: "2025-01-08",
      rateId: "RT004",
      baseRate: "$3,750",
      containerType: "40ft",
      bookingNumber: "CMA987456",
      blNumber: "CMABL456789",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "In Transit":
        return "bg-blue-100 text-blue-800";
      case "Loading":
        return "bg-orange-100 text-orange-800";
      case "Customs Clearance":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredData = shipmentsData.filter((shipment) =>
    Object.values(shipment).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold">Shipment ID</TableHead>
              <TableHead className="font-semibold">Container #</TableHead>
              <TableHead className="font-semibold">Consignee</TableHead>
              <TableHead className="font-semibold">Shipper</TableHead>
              <TableHead className="font-semibold">POL → POD</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Carrier</TableHead>
              <TableHead className="font-semibold">Container Type</TableHead>
              <TableHead className="font-semibold">Rate</TableHead>
              <TableHead className="font-semibold">ETA</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((shipment) => (
              <TableRow
                key={shipment.id}
                className="hover:bg-slate-50 cursor-pointer"
                onClick={() => navigate(`/shipment/${shipment.id}`)}
              >
                <TableCell className="font-medium">{shipment.id}</TableCell>
                <TableCell className="font-mono text-sm">
                  {shipment.containerNumber}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{shipment.consignee}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title={`View CRM record: ${shipment.consigneeId}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/crm/${shipment.consigneeId}`);
                      }}
                    >
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{shipment.shipper}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title={`View CRM record: ${shipment.shipperId}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/crm/${shipment.shipperId}`);
                      }}
                    >
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  <div>{shipment.portOfLoading}</div>
                  <div className="text-slate-500">↓</div>
                  <div>{shipment.portOfDischarge}</div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(shipment.status)}
                  >
                    {shipment.status}
                  </Badge>
                </TableCell>
                <TableCell>{shipment.carrier}</TableCell>
                <TableCell>{shipment.containerType}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{shipment.baseRate}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      title={`View rate details: ${shipment.rateId}`}
                    >
                      <ExternalLink className="w-3 h-3 text-green-500" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{shipment.eta}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/shipment/${shipment.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Showing {filteredData.length} of {shipmentsData.length} shipments
        </span>
        <div className="flex items-center space-x-4">
          <span>ETD: Estimated Time of Departure</span>
          <span>ETA: Estimated Time of Arrival</span>
          <span>POL: Port of Loading</span>
          <span>POD: Port of Discharge</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentsTable;
