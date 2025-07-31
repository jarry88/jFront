import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Ship,
  Package,
  MapPin,
  CheckCircle,
  Loader2,
  Anchor,
  Download,
  Upload,
  MessageSquare,
  AlertTriangle,
  FileText,
  User,
} from "lucide-react";
import { ApiClient, Shipment } from "@/lib/api";

interface ShipmentDetailNewProps {
  shipmentId: number;
  onBack: () => void;
}

const ShipmentDetailNew = ({ shipmentId, onBack }: ShipmentDetailNewProps) => {
  const { toast } = useToast();
  
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  const loadShipmentDetail = async () => {
    if (!shipmentId) {
      toast({
        title: "Error",
        description: "Invalid shipment ID",
        variant: "destructive",
      });
      onBack();
      return;
    }

    try {
      setLoading(true);
      const shipmentData = await ApiClient.getShipmentById(shipmentId);
      setShipment(shipmentData);
    } catch (error) {
      console.error("Error loading shipment detail:", error);
      toast({
        title: "Error",
        description: "Unable to load shipment details",
        variant: "destructive",
      });
      onBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipmentDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentId]);

  // Mock data functions
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

  const getPortCode = (portId: number) => {
    const codes = {
      1: "USLAX",
      2: "CNSHA", 
      3: "DEHAM",
      4: "USNYC",
      5: "NLRTM",
      6: "USLGB",
      7: "FRLEH",
      8: "SGSIN"
    };
    return codes[portId as keyof typeof codes] || `PORT${portId}`;
  };

  const getTerminal = (portId: number) => {
    const terminals = {
      1: "APM Terminal",
      2: "Yangshan Terminal", 
      3: "Container Terminal Tollerort",
      4: "Red Hook Container Terminal",
      5: "ECT Delta Terminal",
      6: "Long Beach Container Terminal",
      7: "Terminal de France",
      8: "PSA Singapore Terminals"
    };
    return terminals[portId as keyof typeof terminals] || "Terminal";
  };

  const getContact = (companyId: number) => {
    const contacts = {
      1: "Sarah Chen",
      2: "Tom Wilson", 
      3: "Hans Mueller",
      4: "Klaus Weber",
      5: "Mike Johnson",
      6: "Jan van der Berg",
      7: "Li Wei",
      8: "Antonio Rossi"
    };
    return contacts[companyId as keyof typeof contacts] || "Contact Person";
  };

  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 17: return { text: "In Transit", color: "bg-blue-100 text-blue-800" };
      case 20: return { text: "Delivered", color: "bg-green-100 text-green-800" };
      case 19: return { text: "Customs Clearance", color: "bg-purple-100 text-purple-800" };
      case 18: return { text: "Loading", color: "bg-yellow-100 text-yellow-800" };
      default: return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
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

  const getProgressStep = (currentStatusId: number) => {
    if (currentStatusId >= 20) return 5; // Delivered
    if (currentStatusId >= 19) return 4; // At Destination Port
    if (currentStatusId >= 17) return 3; // Sailed
    if (currentStatusId >= 16) return 2; // At Port of Loading
    if (currentStatusId >= 15) return 1; // Booked
    return 0;
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
    setCommentText("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Shipment not found</h2>
          <Button onClick={onBack} className="mt-4">
            Back to Shipments
          </Button>
        </div>
      </div>
    );
  }

  const currentStatus = getStatusInfo(shipment.current_status_id);
  const progressStep = getProgressStep(shipment.current_status_id);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Button>
            
            {/* Maersk Logo Placeholder */}
            <div className="w-20 h-8 bg-blue-600 flex items-center justify-center text-white text-xs font-bold rounded">
              Maersk Logo
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Shipment {shipment.shipment_number}
              </h1>
              <p className="text-sm text-gray-600">
                Container {shipment.awb_bol_number}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className={currentStatus.color}>
              {currentStatus.text}
            </Badge>
            <div className="text-right text-sm">
              <div className="font-medium">ETD: {formatDate(shipment.departure_date)}</div>
              <div className="text-gray-600">ETA: {formatDate(shipment.arrival_date)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Progress Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Ship className="w-5 h-5" />
                <span>Shipment Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={(progressStep / 5) * 100} className="h-2" />
              <div className="grid grid-cols-5 gap-4">
                {[
                  { label: "Booked", date: "2025-01-05", icon: Package, step: 1 },
                  { label: "At Port of Loading", date: "2025-01-09", icon: Anchor, step: 2 },
                  { label: "Sailed", date: "2025-01-10", icon: Ship, step: 3 },
                  { label: "At Destination Port", date: "Pending", icon: MapPin, step: 4 },
                  { label: "Delivered", date: "Pending", icon: CheckCircle, step: 5 },
                ].map((milestone, index) => {
                  const Icon = milestone.icon;
                  const isCompleted = progressStep >= milestone.step;
                  const isCurrent = progressStep + 1 === milestone.step;
                  return (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-green-100 text-green-600" :
                        isCurrent ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium">{milestone.label}</div>
                        <div className="text-xs text-gray-500">{milestone.date}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Shipment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Shipment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-8">
                {/* Origin & Destination */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Origin
                    </h4>
                    <div className="space-y-1">
                      <div className="font-medium">{getPortName(shipment.origin_port_id)} <span className="text-blue-600">{getPortCode(shipment.origin_port_id)}</span></div>
                      <div className="text-sm text-gray-600">Terminal: {getTerminal(shipment.origin_port_id)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Destination
                    </h4>
                    <div className="space-y-1">
                      <div className="font-medium">{getPortName(shipment.destination_port_id)} <span className="text-blue-600">{getPortCode(shipment.destination_port_id)}</span></div>
                      <div className="text-sm text-gray-600">Terminal: {getTerminal(shipment.destination_port_id)}</div>
                    </div>
                  </div>
                </div>

                {/* Shipper & Consignee */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Shipper
                    </h4>
                    <div className="space-y-1">
                      <div className="font-medium text-blue-600">{getCompanyName(shipment.shipper_company_id)} →</div>
                      <div className="text-sm text-gray-600">Contact: {getContact(shipment.shipper_company_id)}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Consignee
                    </h4>
                    <div className="space-y-1">
                      <div className="font-medium text-blue-600">{getCompanyName(shipment.consignee_company_id)} →</div>
                      <div className="text-sm text-gray-600">Contact: {getContact(shipment.consignee_company_id)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Container & Commodity Info */}
              <div className="mt-8 pt-6 border-t grid grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-600">Container Type</div>
                  <div className="font-semibold">
                    {shipment.container_size_type_id === 1 ? "40ft HC" : 
                     shipment.container_size_type_id === 2 ? "20ft" : 
                     shipment.container_size_type_id === 3 ? "40ft" : "40ft"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Weight</div>
                  <div className="font-semibold">{shipment.weight_kg} kg</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">CBM</div>
                  <div className="font-semibold">{shipment.volume_cbm || "65.2"}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Commodity</div>
                  <div className="font-semibold">{shipment.commodity_description}</div>
                </div>
              </div>

              {/* Rate */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rate:</span>
                  <span className="text-lg font-bold text-green-600">$3,200 <span className="text-sm text-gray-600">FOB</span></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Documents</span>
              </CardTitle>
              <Button size="sm" className="space-x-2">
                <Upload className="w-4 h-4" />
                <span>Add Document</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Bill of Lading</div>
                      <div className="text-sm text-gray-600">PDF • 245 KB • 2025-01-10</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Booking Confirmation</div>
                      <div className="text-sm text-gray-600">PDF • 128 KB • 2025-01-05</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Notes & Quick Actions */}
        <div className="space-y-6">
          {/* Notes & Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Notes & Comments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-600">Newton Davis</span>
                    <span className="text-blue-600 bg-blue-100 px-2 py-1 rounded text-xs">Internal</span>
                  </div>
                  <p className="text-sm">Container loaded successfully. All documentation verified.</p>
                  <p className="text-xs text-gray-600 mt-2">2025-01-10 14:30</p>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="w-4 h-4 text-orange-600" />
                    <span className="font-medium text-orange-600">Carrier Update</span>
                    <span className="text-orange-600 bg-orange-100 px-2 py-1 rounded text-xs">carrier</span>
                  </div>
                  <p className="text-sm">Vessel departed Los Angeles on schedule. ETA Shanghai remains 2025-01-25.</p>
                  <p className="text-xs text-gray-600 mt-2">2025-01-10 18:45</p>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Add a comment or note..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="mb-3"
                  rows={3}
                />
                <Button onClick={handleAddComment} className="w-full space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Add Comment</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Request Update</span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start space-x-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Flag Issue</span>
              </Button>
              
              <Button variant="outline" className="w-full justify-start space-x-2">
                <Upload className="w-4 h-4" />
                <span>Add Document</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetailNew; 