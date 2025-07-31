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
import { Mail, Phone, Building, MapPin, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CRMTableProps {
  searchQuery: string;
}

const CRMTable = ({ searchQuery }: CRMTableProps) => {
  const navigate = useNavigate();
  // CRM data with customer/consignee information
  const crmData = [
    {
      id: "CRM001",
      companyName: "Global Trading Corp",
      contactPerson: "Sarah Chen",
      email: "sarah.chen@globaltrading.com",
      phone: "+1 (555) 123-4567",
      address: "1234 Business Blvd, Los Angeles, CA 90210",
      country: "United States",
      customerType: "Consignee",
      status: "Active",
      creditLimit: 500000,
      currency: "USD",
      paymentTerms: "Net 30",
      totalShipments: 45,
      lastShipment: "2025-01-20",
      accountManager: "Newton Davis",
      industry: "Electronics",
      website: "www.globaltrading.com",
      taxId: "US123456789",
      incoterms: "FOB",
      specialRequirements: "Temperature controlled",
    },
    {
      id: "CRM002",
      companyName: "European Distributors",
      contactPerson: "Klaus Mueller",
      email: "k.mueller@eudistrib.de",
      phone: "+49 40 123456",
      address: "Hauptstraße 123, 20095 Hamburg, Germany",
      country: "Germany",
      customerType: "Consignee",
      status: "Active",
      creditLimit: 750000,
      currency: "EUR",
      paymentTerms: "Net 45",
      totalShipments: 67,
      lastShipment: "2025-01-18",
      accountManager: "Newton Davis",
      industry: "Automotive",
      website: "www.eudistrib.de",
      taxId: "DE987654321",
      incoterms: "CIF",
      specialRequirements: "Hazmat certified",
    },
    {
      id: "CRM003",
      companyName: "West Coast Imports",
      contactPerson: "Maria Rodriguez",
      email: "maria@westcoastimports.com",
      phone: "+1 (310) 987-6543",
      address: "567 Harbor Drive, Long Beach, CA 90802",
      country: "United States",
      customerType: "Consignee",
      status: "Active",
      creditLimit: 300000,
      currency: "USD",
      paymentTerms: "Net 15",
      totalShipments: 28,
      lastShipment: "2025-01-15",
      accountManager: "Newton Davis",
      industry: "Textiles",
      website: "www.westcoastimports.com",
      taxId: "US987654321",
      incoterms: "DAP",
      specialRequirements: "Customs bond required",
    },
    {
      id: "CRM004",
      companyName: "Asian Trade Partners",
      contactPerson: "Raj Patel",
      email: "raj@asiantradepart.sg",
      phone: "+65 6123 4567",
      address: "100 Marina Bay, Singapore 018960",
      country: "Singapore",
      customerType: "Shipper",
      status: "Active",
      creditLimit: 1000000,
      currency: "SGD",
      paymentTerms: "Net 60",
      totalShipments: 89,
      lastShipment: "2025-01-22",
      accountManager: "Newton Davis",
      industry: "Manufacturing",
      website: "www.asiantradepart.sg",
      taxId: "SG201234567M",
      incoterms: "EXW",
      specialRequirements: "Fumigation certificate",
    },
    {
      id: "CRM005",
      companyName: "Pacific Exports Ltd",
      contactPerson: "Tom Wilson",
      email: "tom.wilson@pacificexports.com",
      phone: "+1 (213) 555-0199",
      address: "2000 Export Plaza, Los Angeles, CA 90021",
      country: "United States",
      customerType: "Shipper",
      status: "Pending",
      creditLimit: 250000,
      currency: "USD",
      paymentTerms: "Prepaid",
      totalShipments: 12,
      lastShipment: "2025-01-10",
      accountManager: "Newton Davis",
      industry: "Food & Beverage",
      website: "www.pacificexports.com",
      taxId: "US456789123",
      incoterms: "FCA",
      specialRequirements: "FDA inspection required",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getCustomerTypeColor = (type: string) => {
    switch (type) {
      case "Consignee":
        return "bg-blue-100 text-blue-800";
      case "Shipper":
        return "bg-purple-100 text-purple-800";
      case "Agent":
        return "bg-green-100 text-green-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredData = crmData.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-slate-200 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold min-w-[80px]">
                CRM ID
              </TableHead>
              <TableHead className="font-semibold min-w-[160px]">
                Company
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Contact Person
              </TableHead>
              <TableHead className="font-semibold min-w-[180px]">
                Contact Info
              </TableHead>
              <TableHead className="font-semibold min-w-[200px]">
                Address
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Type
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Status
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Credit Limit
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Payment Terms
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Shipments
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Last Shipment
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Industry
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Incoterms
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{customer.id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div
                      className="font-medium text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`/crm/${customer.id}`)}
                    >
                      {customer.companyName}
                    </div>
                    {customer.website && (
                      <div className="text-xs text-blue-600 hover:underline cursor-pointer">
                        {customer.website}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className="text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/crm/${customer.id}`)}
                  >
                    {customer.contactPerson}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {customer.email}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start space-x-1 text-sm">
                    <MapPin className="w-3 h-3 text-slate-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{customer.address}</div>
                      <div className="text-slate-500">{customer.country}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getCustomerTypeColor(customer.customerType)}
                  >
                    {customer.customerType}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(customer.status)}
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {customer.currency} {customer.creditLimit.toLocaleString()}
                </TableCell>
                <TableCell>{customer.paymentTerms}</TableCell>
                <TableCell className="text-center font-medium">
                  {customer.totalShipments}
                </TableCell>
                <TableCell className="text-sm">
                  {customer.lastShipment}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.industry}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{customer.incoterms}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="View details"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Send email"
                    >
                      <Mail className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title="Call customer"
                    >
                      <Phone className="w-3 h-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>
          Showing {filteredData.length} of {crmData.length} customers
        </span>
        <div className="flex items-center space-x-4">
          <span>
            Total Credit Exposure: USD{" "}
            {crmData
              .reduce(
                (sum, c) => (c.currency === "USD" ? sum + c.creditLimit : sum),
                0,
              )
              .toLocaleString()}
          </span>
          <span>
            Active Customers:{" "}
            {crmData.filter((c) => c.status === "Active").length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CRMTable;
