import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Ship,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Upload,
  AlertTriangle,
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Anchor,
  Truck,
  Eye,
  Loader2,
  Plane,
} from "lucide-react";
import { ApiClient, Shipment } from "@/lib/api";

const ShipmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 状态管理
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");

  // 加载货运详情
  const loadShipmentDetail = async () => {
    if (!id) {
      toast({
        title: "错误",
        description: "无效的货运ID",
        variant: "destructive",
      });
      navigate("/shipments");
      return;
    }

    try {
      setLoading(true);
      // 直接将API调用结果赋值给 shipmentData，因为API返回的是 Shipment 对象
      const shipmentData = await ApiClient.getShipmentById(parseInt(id));

      // API调用成功，直接设置shipment状态
      setShipment(shipmentData);
    } catch (error) {
      console.error("Error loading shipment detail:", error);
      // API调用失败，在catch块中处理错误
      toast({
        title: "获取货运详情失败",
        description: error instanceof Error ? error.message : "无法加载货运详情，请检查网络连接",
        variant: "destructive",
      });
      navigate("/shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipmentDetail();
  }, [id]);

  // 获取运输模式信息
  const getModeInfo = (modeId: number) => {
    switch (modeId) {
      case 1:
        return { icon: Ship, text: "海运", color: "text-blue-600" };
      case 2:
        return { icon: Plane, text: "空运", color: "text-sky-600" };
      case 3:
        return { icon: Truck, text: "陆运", color: "text-green-600" };
      default:
        return { icon: Package, text: "其他", color: "text-gray-600" };
    }
  };

  // 获取服务类型文本
  const getServiceTypeText = (serviceTypeId: number) => {
    switch (serviceTypeId) {
      case 4: return "FCL"; // Full Container Load
      case 5: return "LCL"; // Less than Container Load
      case 6: return "Express Air";
      default: return "未知";
    }
  };

  // 获取状态信息
  const getStatusInfo = (statusId: number) => {
    switch (statusId) {
      case 14: return { text: "草稿", color: "bg-gray-100 text-gray-800" };
      case 15: return { text: "已确认", color: "bg-blue-100 text-blue-800" };
      case 16: return { text: "已取消", color: "bg-red-100 text-red-800" };
      case 17: return { text: "在途", color: "bg-blue-100 text-blue-800" };
      case 18: return { text: "暂停", color: "bg-yellow-100 text-yellow-800" };
      case 19: return { text: "海关清关", color: "bg-orange-100 text-orange-800" };
      case 20: return { text: "已交付", color: "bg-green-100 text-green-800" };
      default: return { text: "未知", color: "bg-slate-100 text-slate-800" };
    }
  };

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("zh-CN");
  };

  // 格式化日期时间
  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("zh-CN");
  };

  // 获取进度百分比（基于状态）
  const getProgressPercentage = (currentStatusId: number) => {
    switch (currentStatusId) {
      case 14: return 10; // 草稿
      case 15: return 25; // 已确认
      case 17: return 60; // 在途
      case 19: return 80; // 海关清关
      case 20: return 100; // 已交付
      default: return 0;
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // TODO: 实现添加评论的API调用
      toast({
        title: "功能开发中",
        description: "评论功能正在开发中",
      });
      setNewComment("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>加载中...</span>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">货运信息未找到</h2>
          <p className="mt-2 text-gray-600">请检查货运ID是否正确</p>
          <Button onClick={() => navigate("/shipments")} className="mt-4">
            返回货运列表
          </Button>
        </div>
      </div>
    );
  }

  const modeInfo = getModeInfo(shipment.mode_id);
  const currentStatus = getStatusInfo(shipment.current_status_id);
  const ModeIcon = modeInfo.icon;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/shipments")}
              className="space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回列表</span>
            </Button>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg bg-gray-100 ${modeInfo.color}`}>
                <ModeIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  货运 {shipment.shipment_number}
                </h1>
                <p className="text-sm text-slate-600">
                  {modeInfo.text} · {getServiceTypeText(shipment.service_type_id)} · {shipment.awb_bol_number}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className={currentStatus.color}
            >
              {currentStatus.text}
            </Badge>
            <div className="text-right text-sm">
              <div className="font-medium">出发: {formatDate(shipment.departure_date)}</div>
              <div className="text-slate-600">到达: {formatDate(shipment.arrival_date)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Progress Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ship className="w-5 h-5" />
              <span>货运进度</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={getProgressPercentage(shipment.current_status_id)} className="h-2" />
            <div className="grid grid-cols-5 gap-4">
              {[
                { label: "已确认", status: shipment.booking_status_id >= 15 ? "completed" : "pending", icon: Package },
                { label: "准备中", status: shipment.current_status_id >= 17 ? "completed" : "pending", icon: Anchor },
                { label: "在途", status: shipment.current_status_id >= 17 ? "completed" : "pending", icon: Ship },
                { label: "清关", status: shipment.current_status_id >= 19 ? "completed" : shipment.current_status_id === 19 ? "current" : "pending", icon: MapPin },
                { label: "已交付", status: shipment.current_status_id >= 20 ? "completed" : "pending", icon: CheckCircle },
              ].map((milestone, index) => {
                const Icon = milestone.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        milestone.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : milestone.status === "current"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {milestone.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipment Information */}
            <Card>
              <CardHeader>
                <CardTitle>货运详细信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">基本信息</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">货运单号:</span>
                          <span className="text-sm font-medium">{shipment.shipment_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">AWB/BOL号:</span>
                          <span className="text-sm font-medium">{shipment.awb_bol_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">船班/航班号:</span>
                          <span className="text-sm font-medium">{shipment.vessel_flight_number || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">集装箱号:</span>
                          <span className="text-sm font-medium">{shipment.container_awb_id_ref || "-"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">货物信息</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">货物描述:</span>
                          <span className="text-sm font-medium max-w-48 text-right">
                            {shipment.commodity_description}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">件数:</span>
                          <span className="text-sm font-medium">{shipment.pieces}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">重量:</span>
                          <span className="text-sm font-medium">{shipment.weight_kg} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">体积:</span>
                          <span className="text-sm font-medium">{shipment.volume_cbm || "-"} CBM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">计费重量:</span>
                          <span className="text-sm font-medium">{shipment.chargeable_weight_kg} kg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">时间信息</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">预订日期:</span>
                          <span className="text-sm font-medium">{formatDate(shipment.booking_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">出发日期:</span>
                          <span className="text-sm font-medium">{formatDate(shipment.departure_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">到达日期:</span>
                          <span className="text-sm font-medium">{formatDate(shipment.arrival_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">创建时间:</span>
                          <span className="text-sm font-medium">{formatDateTime(shipment.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">更新时间:</span>
                          <span className="text-sm font-medium">{formatDateTime(shipment.updated_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">公司信息</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">托运人:</span>
                          <span className="text-sm font-medium">公司 #{shipment.shipper_company_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">收货人:</span>
                          <span className="text-sm font-medium">公司 #{shipment.consignee_company_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">承运商:</span>
                          <span className="text-sm font-medium">公司 #{shipment.carrier_company_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">起始港:</span>
                          <span className="text-sm font-medium">港口 #{shipment.origin_port_id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-slate-600">目的港:</span>
                          <span className="text-sm font-medium">港口 #{shipment.destination_port_id}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {shipment.remarks && (
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <h4 className="font-semibold text-slate-700 mb-2">备注信息</h4>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                      {shipment.remarks}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents - 占位符 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>相关文档</span>
                  </div>
                  <Button size="sm" className="space-x-2">
                    <Upload className="w-4 h-4" />
                    <span>上传文档</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>文档管理功能开发中...</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>备注和评论</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4 text-slate-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">暂无评论</p>
                </div>

                <div className="space-y-3">
                  <Textarea
                    placeholder="添加备注或评论..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleAddComment}
                    className="w-full space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>添加评论</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => {
                    toast({
                      title: "功能开发中",
                      description: "状态更新功能正在开发中",
                    });
                  }}
                >
                  <Clock className="w-4 h-4" />
                  <span>更新状态</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => {
                    toast({
                      title: "功能开发中",
                      description: "问题标记功能正在开发中",
                    });
                  }}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>标记问题</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start space-x-2"
                  onClick={() => {
                    toast({
                      title: "功能开发中",
                      description: "文档上传功能正在开发中",
                    });
                  }}
                >
                  <Upload className="w-4 h-4" />
                  <span>上传文档</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;
