import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Mail,
  Phone,
  MessageCircle,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Ship,
  TrendingUp,
  Eye,
  Tag,
  Globe,
  User,
  ExternalLink,
} from "lucide-react";

const CRMProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");

  // Mock CRM data - in real app, this would be fetched based on ID
  const contactData = {
    id: "CRM001",
    companyName: "Global Trading Corp",
    contactPerson: "Sarah Chen",
    role: "Head of Procurement",
    email: "sarah.chen@globaltrading.com",
    phone: "+1 (555) 123-4567",
    whatsapp: "+1 (555) 123-4567",
    wechat: "sarahchen_global",
    website: "www.globaltrading.com",
    address: "1234 Business Blvd, Los Angeles, CA 90210",
    country: "United States",
    region: "North America",
    customerType: "Consignee",
    status: "Active",
    creditLimit: 500000,
    currency: "USD",
    paymentTerms: "Net 30",
    accountManager: "Newton Davis",
    industry: "Electronics",
    taxId: "US123456789",
    incoterms: "FOB",
    specialRequirements: "Temperature controlled shipments required",
    lastContact: "2025-01-20",
    tags: ["High Volume", "Priority Client", "Asia Lane", "Electronics"],
    stats: {
      requestsYTD: 47,
      shipmentsYTD: 32,
      activeShipments: 5,
      totalValue: 1250000,
    },
    notes: [
      {
        id: 1,
        author: "Newton Davis",
        content: "Prefer morning calls PST. Very responsive to WhatsApp.",
        date: "2025-01-15",
        tags: ["Communication"],
      },
      {
        id: 2,
        author: "Newton Davis",
        content:
          "Looking to expand to Southeast Asia routes. Interested in Vietnam and Thailand.",
        date: "2025-01-10",
        tags: ["Business Development"],
      },
    ],
    emailLog: [
      {
        id: 1,
        date: "2025-01-20",
        subject: "Rate Request - LA to Shanghai Q1 2025",
        snippet:
          "Hi Newton, Could you please provide updated rates for our Q1 shipments from LA to Shanghai...",
        source: "Gmail",
        tags: ["Rate Request", "Quote"],
        thread: true,
      },
      {
        id: 2,
        date: "2025-01-18",
        subject: "Container MSKU7845123 - Delivery Confirmation",
        snippet:
          "Thank you for the update. The delivery was completed successfully and our client is satisfied...",
        source: "Outlook",
        tags: ["Delivery", "Confirmation"],
        thread: false,
      },
      {
        id: 3,
        date: "2025-01-15",
        subject: "New Partnership Opportunities",
        snippet:
          "We're exploring new trade lanes and would like to discuss potential partnership opportunities...",
        source: "Gmail",
        tags: ["Business Development"],
        thread: true,
      },
      {
        id: 4,
        date: "2025-01-12",
        subject: "Documentation Requirements for Electronics",
        snippet:
          "Could you clarify the documentation requirements for electronics shipments to China...",
        source: "Outlook",
        tags: ["Documentation", "Compliance"],
        thread: false,
      },
    ],
  };

  const getTagColor = (tag: string) => {
    const colors = {
      "High Volume": "bg-purple-100 text-purple-800",
      "Priority Client": "bg-red-100 text-red-800",
      "Asia Lane": "bg-blue-100 text-blue-800",
      Electronics: "bg-green-100 text-green-800",
      Communication: "bg-orange-100 text-orange-800",
      "Business Development": "bg-indigo-100 text-indigo-800",
      "Rate Request": "bg-yellow-100 text-yellow-800",
      Quote: "bg-cyan-100 text-cyan-800",
      Delivery: "bg-teal-100 text-teal-800",
      Confirmation: "bg-emerald-100 text-emerald-800",
      Documentation: "bg-slate-100 text-slate-800",
      Compliance: "bg-pink-100 text-pink-800",
    };
    return colors[tag as keyof typeof colors] || "bg-slate-100 text-slate-800";
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In real app, this would be an API call
      setNewNote("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {contactData.companyName}
                </h1>
                <p className="text-sm text-slate-600">
                  {contactData.contactPerson} • {contactData.role}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="space-x-2">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Button>
              <Button variant="outline" size="sm" className="space-x-2">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </Button>
              <Button variant="outline" size="sm" className="space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </Button>
            </div>
            <div className="text-right text-sm">
              <div className="font-medium">Last Contact</div>
              <div className="text-slate-600">{contactData.lastContact}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex items-center space-x-2">
          {contactData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className={getTagColor(tag)}>
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {contactData.stats.requestsYTD}
                  </div>
                  <div className="text-sm text-slate-600">
                    Requests Made (YTD)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Ship className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {contactData.stats.shipmentsYTD}
                  </div>
                  <div className="text-sm text-slate-600">
                    Shipments Booked (YTD)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {contactData.stats.activeShipments}
                  </div>
                  <div className="text-sm text-slate-600">
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Active Shipments
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">
                    {contactData.currency}{" "}
                    {contactData.stats.totalValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-600">
                    Total Value (YTD)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {contactData.email}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Phone</div>
                        <div className="text-sm text-slate-600">
                          {contactData.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">WhatsApp</div>
                        <div className="text-sm text-slate-600">
                          {contactData.whatsapp}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Website</div>
                        <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {contactData.website}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <div className="font-medium">Address</div>
                        <div className="text-sm text-slate-600">
                          {contactData.address}
                        </div>
                        <div className="text-sm text-slate-600">
                          {contactData.country}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Account Manager</div>
                        <div className="text-sm text-slate-600">
                          {contactData.accountManager}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-slate-400" />
                      <div>
                        <div className="font-medium">Industry</div>
                        <div className="text-sm text-slate-600">
                          {contactData.industry}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="font-medium text-slate-700">
                        Credit Limit
                      </div>
                      <div className="text-sm text-slate-600">
                        {contactData.currency}{" "}
                        {contactData.creditLimit.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">
                        Payment Terms
                      </div>
                      <div className="text-sm text-slate-600">
                        {contactData.paymentTerms}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">
                        Incoterms
                      </div>
                      <div className="text-sm text-slate-600">
                        {contactData.incoterms}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-slate-700">Status</div>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {contactData.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {contactData.specialRequirements && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-800 mb-1">
                      Special Requirements
                    </div>
                    <div className="text-sm text-yellow-700">
                      {contactData.specialRequirements}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Contact Log */}
            <Card>
              <CardHeader>
                <CardTitle>Email Contact Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contactData.emailLog.map((email) => (
                    <div
                      key={email.id}
                      className="border border-slate-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium">{email.subject}</span>
                            {email.thread && (
                              <Badge variant="outline" className="text-xs">
                                Thread
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mb-2">
                            {email.snippet}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-slate-500">
                            <span>{email.date}</span>
                            <span>via {email.source}</span>
                            <div className="flex items-center space-x-1">
                              {email.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className={`text-xs ${getTagColor(tag)}`}
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Tag className="w-5 h-5" />
                  <span>Internal Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {contactData.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {note.author}
                        </span>
                        <span className="text-xs text-slate-500">
                          {note.date}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">
                        {note.content}
                      </p>
                      <div className="flex items-center space-x-1">
                        {note.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={`text-xs ${getTagColor(tag)}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder="Add internal note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handleAddNote} className="w-full space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Add Note</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Last Email</span>
                    <span className="text-slate-600">Jan 20, 2025</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Last Shipment</span>
                    <span className="text-slate-600">Jan 18, 2025</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <span className="text-green-600">~2 hours</span>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-center">
                    <span>Satisfaction</span>
                    <span className="text-green-600">High</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRMProfile;
