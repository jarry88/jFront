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
import { Edit, Copy, Archive } from "lucide-react";

interface RatesTableProps {
  searchQuery: string;
}

const RatesTable = ({ searchQuery }: RatesTableProps) => {
  // Comprehensive rates data with all specified columns
  const ratesData = [
    {
      id: "RT001",
      carrierId: "CAR001",
      portOfOrigin: "Los Angeles, CA",
      portOfLoading: "Los Angeles, CA",
      portOfDischarge: "Shanghai, China",
      portOfFinalDischarge: "Shanghai, China",
      containerType: "40ft HC",
      baseRate: 3200.0,
      currency: "USD",
      validFrom: "2025-01-01",
      validTo: "2025-03-31",
      rateType: "Contract",
      sourceType: "Direct",
      sourceReference: "MSK-2025-Q1",
      status: "Active",
      createdAt: "2024-12-15",
      provider: "Maersk Line",
      tradelane: "Transpacific",
      revisions: 2,
      contractNumber: "MSK-CNT-2025-001",
      remarks: "Peak season surcharge applicable",
      demurrage: 150.0,
      detention: 200.0,
      contractType: "Annual",
      rhNor: "RH",
    },
    {
      id: "RT002",
      carrierId: "CAR002",
      portOfOrigin: "Hamburg, Germany",
      portOfLoading: "Hamburg, Germany",
      portOfDischarge: "New York, NY",
      portOfFinalDischarge: "New York, NY",
      containerType: "20ft",
      baseRate: 2850.0,
      currency: "USD",
      validFrom: "2025-01-15",
      validTo: "2025-06-30",
      rateType: "Spot",
      sourceType: "Freight Forwarder",
      sourceReference: "COS-FF-2025-01",
      status: "Active",
      createdAt: "2025-01-10",
      provider: "COSCO Shipping",
      tradelane: "Transatlantic",
      revisions: 1,
      contractNumber: "COS-CNT-2025-002",
      remarks: "Subject to BAF adjustments",
      demurrage: 120.0,
      detention: 180.0,
      contractType: "Quarterly",
      rhNor: "NOR",
    },
    {
      id: "RT003",
      carrierId: "CAR003",
      portOfOrigin: "Rotterdam, Netherlands",
      portOfLoading: "Rotterdam, Netherlands",
      portOfDischarge: "Long Beach, CA",
      portOfFinalDischarge: "Los Angeles, CA",
      containerType: "40ft HC",
      baseRate: 4350.0,
      currency: "USD",
      validFrom: "2025-01-01",
      validTo: "2025-12-31",
      rateType: "Contract",
      sourceType: "Direct",
      sourceReference: "EVR-DIR-2025",
      status: "Active",
      createdAt: "2024-12-20",
      provider: "Evergreen Marine",
      tradelane: "Transatlantic",
      revisions: 0,
      contractNumber: "EVR-CNT-2025-003",
      remarks: "Includes THC at destination",
      demurrage: 175.0,
      detention: 220.0,
      contractType: "Annual",
      rhNor: "RH",
    },
    {
      id: "RT004",
      carrierId: "CAR004",
      portOfOrigin: "Le Havre, France",
      portOfLoading: "Le Havre, France",
      portOfDischarge: "Singapore",
      portOfFinalDischarge: "Singapore",
      containerType: "40ft",
      baseRate: 3750.0,
      currency: "USD",
      validFrom: "2025-01-05",
      validTo: "2025-04-30",
      rateType: "Contract",
      sourceType: "NVOCC",
      sourceReference: "CMA-NVOCC-2025",
      status: "Pending",
      createdAt: "2025-01-05",
      provider: "CMA CGM",
      tradelane: "Asia-Europe",
      revisions: 1,
      contractNumber: "CMA-CNT-2025-004",
      remarks: "Rate includes documentation fees",
      demurrage: 140.0,
      detention: 190.0,
      contractType: "Quarterly",
      rhNor: "NOR",
    },
    {
      id: "RT005",
      carrierId: "CAR005",
      portOfOrigin: "Tokyo, Japan",
      portOfLoading: "Tokyo, Japan",
      portOfDischarge: "Seattle, WA",
      portOfFinalDischarge: "Seattle, WA",
      containerType: "20ft",
      baseRate: 2950.0,
      currency: "USD",
      validFrom: "2024-12-01",
      validTo: "2025-01-31",
      rateType: "Spot",
      sourceType: "Digital Platform",
      sourceReference: "ONE-DIG-2024",
      status: "Expired",
      createdAt: "2024-11-25",
      provider: "Ocean Network Express",
      tradelane: "Transpacific",
      revisions: 3,
      contractNumber: "ONE-CNT-2024-005",
      remarks: "Winter schedule rates",
      demurrage: 130.0,
      detention: 170.0,
      contractType: "Monthly",
      rhNor: "RH",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Draft":
        return "bg-slate-100 text-slate-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getRateTypeColor = (rateType: string) => {
    switch (rateType) {
      case "Contract":
        return "bg-blue-100 text-blue-800";
      case "Spot":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const filteredData = ratesData.filter((rate) =>
    Object.values(rate).some((value) =>
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
                Rate ID
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Carrier
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Origin
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">POL</TableHead>
              <TableHead className="font-semibold min-w-[120px]">POD</TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Final Dest
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Container
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Base Rate
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Currency
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Valid From
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Valid To
              </TableHead>
              <TableHead className="font-semibold min-w-[90px]">
                Rate Type
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Source
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Reference
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Status
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Created
              </TableHead>
              <TableHead className="font-semibold min-w-[120px]">
                Tradelane
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                Revisions
              </TableHead>
              <TableHead className="font-semibold min-w-[140px]">
                Contract #
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Demurrage
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Detention
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Contract Type
              </TableHead>
              <TableHead className="font-semibold min-w-[80px]">
                RH/NOR
              </TableHead>
              <TableHead className="font-semibold min-w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((rate) => (
              <TableRow key={rate.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{rate.id}</TableCell>
                <TableCell>{rate.provider}</TableCell>
                <TableCell className="text-sm">{rate.portOfOrigin}</TableCell>
                <TableCell className="text-sm">{rate.portOfLoading}</TableCell>
                <TableCell className="text-sm">
                  {rate.portOfDischarge}
                </TableCell>
                <TableCell className="text-sm">
                  {rate.portOfFinalDischarge}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{rate.containerType}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  {rate.currency} {rate.baseRate.toLocaleString()}
                </TableCell>
                <TableCell>{rate.currency}</TableCell>
                <TableCell className="text-sm">{rate.validFrom}</TableCell>
                <TableCell className="text-sm">{rate.validTo}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getRateTypeColor(rate.rateType)}
                  >
                    {rate.rateType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{rate.sourceType}</TableCell>
                <TableCell className="text-sm font-mono">
                  {rate.sourceReference}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(rate.status)}
                  >
                    {rate.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{rate.createdAt}</TableCell>
                <TableCell>{rate.tradelane}</TableCell>
                <TableCell className="text-center">{rate.revisions}</TableCell>
                <TableCell className="text-sm font-mono">
                  {rate.contractNumber}
                </TableCell>
                <TableCell>
                  {rate.currency} {rate.demurrage}
                </TableCell>
                <TableCell>
                  {rate.currency} {rate.detention}
                </TableCell>
                <TableCell>{rate.contractType}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {rate.rhNor}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Archive className="w-3 h-3" />
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
          Showing {filteredData.length} of {ratesData.length} rates
        </span>
        <div className="flex items-center space-x-4">
          <span>POL: Port of Loading</span>
          <span>POD: Port of Discharge</span>
          <span>RH: Rate Hold</span>
          <span>NOR: No Rate Hold</span>
        </div>
      </div>
    </div>
  );
};

export default RatesTable;
