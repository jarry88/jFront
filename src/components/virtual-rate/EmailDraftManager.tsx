import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Mail,
  Send,
  Save,
  Copy,
  Eye,
  Edit,
  Users,
  Calendar,
  FileText,
  Sparkles,
  Plus,
  Clock,
} from "lucide-react";

interface EmailDraftManagerProps {
  isFullScreen?: boolean;
}

const EmailDraftManager = ({
  isFullScreen = false,
}: EmailDraftManagerProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [activeTab, setActiveTab] = useState("compose");

  const emailTemplates = [
    {
      id: "weekly-rates",
      name: "Weekly Rate Update",
      category: "Regular Updates",
      subject: "Weekly Ocean Freight Rates - {{date}}",
      body: `Dear {{customer_name}},

Please find below the updated ocean freight rates for your key trade lanes:

{{port_pair_rates}}

Key highlights this week:
• Market conditions remain stable
• Fuel surcharges updated
• New services available on select routes

Best regards,
{{sender_name}}`,
      lastUsed: "2025-01-20",
      usage: 47,
    },
    {
      id: "market-update",
      name: "Market Analysis",
      category: "Market Intelligence",
      subject: "Ocean Freight Market Update - {{month}} {{year}}",
      body: `Dear {{customer_name}},

Our monthly market analysis for {{month}} highlights:

**Rate Trends:**
{{rate_trends}}

**Capacity Updates:**
{{capacity_updates}}

**Recommendations:**
{{recommendations}}

Feel free to reach out for detailed discussions.

Best regards,
{{sender_name}}`,
      lastUsed: "2025-01-18",
      usage: 23,
    },
    {
      id: "rate-quote",
      name: "Rate Quotation",
      category: "Sales",
      subject: "Ocean Freight Quote - {{origin}} to {{destination}}",
      body: `Dear {{customer_name}},

Thank you for your rate inquiry. Please find our competitive quotation below:

**Route:** {{origin}} → {{destination}}
**Equipment:** {{container_type}}
**Rate:** {{quoted_rate}}
**Transit Time:** {{transit_time}}
**Validity:** {{validity_period}}

Terms and conditions:
{{terms_conditions}}

Looking forward to your business.

Best regards,
{{sender_name}}`,
      lastUsed: "2025-01-22",
      usage: 89,
    },
    {
      id: "service-update",
      name: "Service Announcement",
      category: "Operations",
      subject: "Service Update - {{service_name}}",
      body: `Dear Valued Customer,

We would like to inform you of the following service update:

**Service:** {{service_name}}
**Effective Date:** {{effective_date}}
**Changes:** {{service_changes}}

**Impact to Your Shipments:**
{{impact_details}}

Our team is available to discuss any questions you may have.

Best regards,
{{sender_name}}`,
      lastUsed: "2025-01-15",
      usage: 12,
    },
  ];

  const draftEmails = [
    {
      id: "draft-1",
      subject: "Q1 Rate Update - Asia to US Routes",
      recipient: "Multiple Recipients (12)",
      lastModified: "2025-01-22 10:30",
      status: "Draft",
      preview:
        "Dear valued customers, We are pleased to share our Q1 rate updates for key Asia to US routes...",
    },
    {
      id: "draft-2",
      subject: "New Service - Hamburg Express",
      recipient: "European Customers (8)",
      lastModified: "2025-01-21 15:45",
      status: "Ready to Send",
      preview:
        "We are excited to announce our new Hamburg Express service connecting Europe to...",
    },
    {
      id: "draft-3",
      subject: "Market Intelligence - January Report",
      recipient: "VIP Customers (15)",
      lastModified: "2025-01-20 09:15",
      status: "Scheduled",
      preview:
        "Our January market intelligence report highlights significant trends in ocean freight...",
    },
  ];

  const recipientGroups = [
    { id: "asia-customers", name: "Asia Trade Lane Customers", count: 23 },
    { id: "europe-customers", name: "Europe Trade Lane Customers", count: 18 },
    { id: "vip-customers", name: "VIP Customers", count: 15 },
    { id: "new-customers", name: "New Customers", count: 7 },
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = emailTemplates.find((t) => t.id === templateId);
    if (template) {
      setEmailSubject(template.subject);
      setEmailBody(template.body);
      setSelectedTemplate(templateId);
    }
  };

  const handleSaveDraft = () => {
    // Implementation for saving draft
    console.log("Saving draft...");
  };

  const handleSendEmail = () => {
    // Implementation for sending email
    console.log("Sending email...");
  };

  return (
    <div className={`${isFullScreen ? "h-full" : ""} space-y-6`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose" className="space-x-2">
            <Edit className="w-4 h-4" />
            <span>Compose</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="space-x-2">
            <FileText className="w-4 h-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="space-x-2">
            <Clock className="w-4 h-4" />
            <span>Drafts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="w-5 h-5" />
                  <span>Compose Email</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Enhance</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveDraft}
                    className="space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Template
                  </label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={handleTemplateSelect}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Recipients
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipient group" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipientGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name} ({group.count})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Subject
                </label>
                <Input
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Enter email subject..."
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Message Body
                </label>
                <Textarea
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Compose your email message..."
                  className={`${isFullScreen ? "min-h-[400px]" : "min-h-[200px]"}`}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </Button>
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Users className="w-4 h-4" />
                    <span>Test Send</span>
                  </Button>
                  <Button variant="outline" size="sm" className="space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Schedule</span>
                  </Button>
                </div>
                <Button onClick={handleSendEmail} className="space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Send Email</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Email Templates
            </h3>
            <Button size="sm" className="space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emailTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {template.name}
                      </h4>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-slate-700">
                      {template.subject}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-3">
                      {template.body.substring(0, 150)}...
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                      <span>Used {template.usage} times</span>
                      <span>Last: {template.lastUsed}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="drafts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Draft Emails
            </h3>
            <Button variant="outline" size="sm" className="space-x-2">
              <Send className="w-4 h-4" />
              <span>Send All Ready</span>
            </Button>
          </div>

          <div className="space-y-3">
            {draftEmails.map((draft) => (
              <Card
                key={draft.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-slate-800">
                          {draft.subject}
                        </h4>
                        <Badge
                          variant="secondary"
                          className={
                            draft.status === "Ready to Send"
                              ? "bg-green-100 text-green-800"
                              : draft.status === "Scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {draft.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">
                        To: {draft.recipient} • Modified: {draft.lastModified}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-2">
                        {draft.preview}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmailDraftManager;
