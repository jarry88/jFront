import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Upload,
  Mail,
  FileSpreadsheet,
  CheckCircle,
  Copy,
  Send,
} from "lucide-react";

const RateSubmission = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [submissionMethod, setSubmissionMethod] = useState<
    "upload" | "email" | null
  >(null);
  const [submitted, setSubmitted] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = () => {
    // Simulate file upload
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleEmailSubmit = () => {
    // Simulate email sending
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const copyEmailAddress = () => {
    navigator.clipboard.writeText("rates@janus.solutions");
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["xlsx", "xls", "csv"].includes(extension || "")) {
      return <FileSpreadsheet className="w-5 h-5 text-green-600" />;
    }
    return <Upload className="w-5 h-5 text-slate-400" />;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Rates Submitted Successfully!
            </h2>
            <p className="text-slate-600 mb-6">
              Your rate information has been received. Our team will review and
              process it shortly.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Submit Rates
                </h1>
                <p className="text-sm text-slate-600">
                  Upload rate sheets or email directly to our rates team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {!submissionMethod ? (
            /* Method Selection */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                onClick={() => setSubmissionMethod("upload")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Upload Rate Sheets</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">
                    Upload your rate sheets directly to our system. Supports
                    Excel, CSV, and other common formats.
                  </p>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li>• Instant upload and processing</li>
                    <li>• Supports .xlsx, .xls, .csv files</li>
                    <li>• Automatic validation</li>
                    <li>• Real-time status updates</li>
                  </ul>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                onClick={() => setSubmissionMethod("email")}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Email to Rates Team</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-slate-600 mb-4">
                    Send rates directly to our rates team via email. Perfect for
                    complex rate structures or special arrangements.
                  </p>
                  <ul className="text-sm text-slate-500 space-y-1">
                    <li>• Direct communication with rates team</li>
                    <li>• Include detailed explanations</li>
                    <li>• Attach multiple documents</li>
                    <li>• Personal follow-up available</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          ) : submissionMethod === "upload" ? (
            /* File Upload Interface */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  Upload Rate Sheets
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSubmissionMethod(null)}
                >
                  Choose Different Method
                </Button>
              </div>

              <Card>
                <CardContent className="p-8">
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-300 hover:border-slate-400"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Drop your rate sheets here
                    </h3>
                    <p className="text-slate-500 mb-4">
                      Or click to browse and select files
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".xlsx,.xls,.csv,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload">
                      <Button variant="outline" className="cursor-pointer">
                        Browse Files
                      </Button>
                    </Label>
                    <p className="text-xs text-slate-400 mt-2">
                      Supported formats: .xlsx, .xls, .csv, .pdf (Max 10MB each)
                    </p>
                  </div>

                  {files.length > 0 && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-slate-700 mb-3">
                        Selected Files ({files.length})
                      </h4>
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {getFileIcon(file.name)}
                              <div>
                                <div className="font-medium text-sm">
                                  {file.name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <Button
                        onClick={handleUploadSubmit}
                        className="w-full space-x-2"
                        size="lg"
                      >
                        <Upload className="w-5 h-5" />
                        <span>Upload {files.length} File(s)</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Email Interface */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-800">
                  Email Rates to Team
                </h2>
                <Button
                  variant="outline"
                  onClick={() => setSubmissionMethod(null)}
                >
                  Choose Different Method
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compose Email</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email-to">To</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="email-to"
                          value="rates@janus.solutions"
                          disabled
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyEmailAddress}
                          className="space-x-1"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email-subject">Subject</Label>
                      <Input
                        id="email-subject"
                        placeholder="Rate submission - [Your company name]"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email-body">Message</Label>
                      <Textarea
                        id="email-body"
                        placeholder="Please include details about your rate submission, trade lanes, validity periods, and any special requirements..."
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="mt-1 min-h-[120px]"
                      />
                    </div>

                    <Button
                      onClick={handleEmailSubmit}
                      className="w-full space-x-2"
                      disabled={!emailSubject.trim()}
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Email</span>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">
                          What to Include:
                        </h4>
                        <ul className="text-sm text-slate-600 space-y-1">
                          <li>• Your company name and contact information</li>
                          <li>• Trade lanes (origin → destination)</li>
                          <li>• Container types and rates</li>
                          <li>• Validity periods</li>
                          <li>• Special terms or conditions</li>
                          <li>• Carrier information (if applicable)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-700 mb-2">
                          Response Time:
                        </h4>
                        <p className="text-sm text-slate-600">
                          Our rates team typically responds within 2-4 business
                          hours during working days.
                        </p>
                      </div>

                      <div className="p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-1">
                          Pro Tip:
                        </h4>
                        <p className="text-sm text-blue-700">
                          Attach rate sheets as Excel or CSV files for faster
                          processing. Include your preferred response format.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateSubmission;
