// API配置
const API_BASE_URL = "http://localhost:8000";
const API_V1_STR = "/api/v1";

// 类型定义
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface ApiError {
  success: boolean;
  message: string;
  error_code: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id: number | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  company_id?: number | null;
  password: string;
  is_active?: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  company_id?: number | null;
  is_active?: boolean;
  password?: string;
}

export interface UserListResponse {
  items: User[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface UserListParams {
  page?: number;
  size?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
}

// 新增 RoleInfo 类型
export interface RoleInfo {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface RoleCreate {
  name: string;
  description?: string;
}

export interface RoleUpdate {
  name?: string;
  description?: string;
}

// Shipment 相关类型定义
export interface Shipment {
  id: number;
  shipment_number: string;
  awb_bol_number: string;
  mode_id: number;
  service_type_id: number;
  booking_date?: string;
  shipper_company_id: number;
  consignee_company_id: number;
  origin_port_id: number;
  destination_port_id: number;
  departure_date?: string;
  arrival_date?: string;
  carrier_company_id: number;
  vessel_flight_number?: string;
  container_awb_id_ref?: string;
  commodity_description: string;
  pieces: number;
  weight_kg: string; // Decimal as string
  volume_cbm?: string; // Decimal as string
  chargeable_weight_kg: string; // Decimal as string
  container_size_type_id?: number;
  booking_status_id: number;
  current_status_id: number;
  final_status_id: number;
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface ShipmentListResponse {
  items: Shipment[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ShipmentCreateRequest {
  shipment_number: string;
  awb_bol_number: string;
  mode_id: number;
  service_type_id: number;
  booking_date?: string;
  shipper_company_id: number;
  consignee_company_id: number;
  origin_port_id: number;
  destination_port_id: number;
  departure_date?: string;
  arrival_date?: string;
  carrier_company_id: number;
  vessel_flight_number?: string;
  container_awb_id_ref?: string;
  commodity_description: string;
  pieces: number;
  weight_kg: string;
  volume_cbm?: string;
  chargeable_weight_kg: string;
  container_size_type_id?: number;
  booking_status_id: number;
  current_status_id: number;
  final_status_id: number;
  remarks?: string;
}

export interface ShipmentUpdate {
  shipment_number?: string;
  awb_bol_number?: string;
  mode_id?: number;
  service_type_id?: number;
  booking_date?: string;
  shipper_company_id?: number;
  consignee_company_id?: number;
  origin_port_id?: number;
  destination_port_id?: number;
  departure_date?: string;
  arrival_date?: string;
  carrier_company_id?: number;
  vessel_flight_number?: string;
  container_awb_id_ref?: string;
  commodity_description?: string;
  pieces?: number;
  weight_kg?: string;
  volume_cbm?: string;
  chargeable_weight_kg?: string;
  container_size_type_id?: number;
  booking_status_id?: number;
  current_status_id?: number;
  final_status_id?: number;
  remarks?: string;
}

export interface ShipmentListParams {
  page?: number;
  size?: number;
  search?: string;
  status_id?: number;
  carrier_id?: number;
  shipper_id?: number;
}


// API工具函数
export class ApiClient {
  private static getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = localStorage.getItem("access_token");
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiError;
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return data as T;
  }

  // 用户登录
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  // 获取当前用户信息
  static async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/me`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<User>(response);
  }

  // 用户登出
  static async logout(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/logout`, {
      method: "POST",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ success: boolean; message: string }>(response);
  }

  // 检查token是否有效
  static async validateToken(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  // =============================================================================
  // Shipment 相关API方法
  // =============================================================================

  // 获取货运列表
  static async getShipments(params: ShipmentListParams = {}): Promise<ShipmentListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status_id) queryParams.append('status_id', params.status_id.toString());
    if (params.carrier_id) queryParams.append('carrier_id', params.carrier_id.toString());
    if (params.shipper_id) queryParams.append('shipper_id', params.shipper_id.toString());

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}${API_V1_STR}/shipments/${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<ShipmentListResponse>(response);
  }

  // 根据ID获取货运详情
  static async getShipmentById(id: number): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/${id}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Shipment>(response);
  }

  // 根据货运单号获取货运详情
  static async getShipmentByNumber(number: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/search/by-number/${number}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Shipment>(response);
  }

  // 根据AWB/BOL号获取货运详情
  static async getShipmentByAwbBol(number: string): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/search/by-awb-bol/${number}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<Shipment>(response);
  }

  // 创建货运
  static async createShipment(shipmentData: ShipmentCreateRequest): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(shipmentData),
    });

    return this.handleResponse<Shipment>(response);
  }

  // 更新货运
  static async updateShipment(id: number, shipmentData: ShipmentUpdate): Promise<Shipment> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/${id}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(shipmentData),
    });

    return this.handleResponse<Shipment>(response);
  }

  // 删除货运
  static async deleteShipment(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/shipments/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ success: boolean; message: string }>(response);
  }

  // =============================================================================
  // User Admin 相关API方法
  // =============================================================================

  // 获取用户列表
  static async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

    const queryString = queryParams.toString();
    // 假设后端的路由前缀是 /auth/users
    const url = `${API_BASE_URL}${API_V1_STR}/auth/users/${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    // 假设后端现在返回完整的 UserListResponse 对象
    const data = await this.handleResponse<any>(response);
    // 检查响应数据是否包含分页信息，如果没有，则自行构建
    if (Array.isArray(data)) {
      return {
        items: data,
        total: data.length, // 仅为占位符
        page: 1,
        size: data.length,
        pages: 1,
      } as UserListResponse;
    }
    return data as UserListResponse;
  }

  // 根据ID获取用户详情
  static async getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/users/${id}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<User>(response);
  }

  // 创建用户
  static async createUser(userData: UserCreate): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/users/`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  // 更新用户
  static async updateUser(id: number, userData: UserUpdate): Promise<User> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/users/${id}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<User>(response);
  }

  // 删除用户
  static async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/users/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });

    return this.handleResponse<{ success: boolean; message: string }>(response);
  }

  // =============================================================================
  // Role Admin 相关API方法 (新增)
  // =============================================================================

  //...
  static async getRoleById(id: number): Promise<RoleInfo> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/roles/${id}`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    return this.handleResponse<RoleInfo>(response);
  }

  // 获取所有角色
  static async getRoles(): Promise<RoleInfo[]> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/roles`, {
      method: "GET",
      headers: this.getHeaders(true),
    });
    return this.handleResponse<RoleInfo[]>(response);
  }

  // 创建新角色
  static async createRole(roleData: RoleCreate): Promise<RoleInfo> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/roles`, {
      method: "POST",
      headers: this.getHeaders(true),
      body: JSON.stringify(roleData),
    });
    return this.handleResponse<RoleInfo>(response);
  }

  // 更新角色
  static async updateRole(id: number, roleData: RoleUpdate): Promise<RoleInfo> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/roles/${id}`, {
      method: "PUT",
      headers: this.getHeaders(true),
      body: JSON.stringify(roleData),
    });
    return this.handleResponse<RoleInfo>(response);
  }

  // 删除角色
  static async deleteRole(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}${API_V1_STR}/auth/roles/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(true),
    });
    return this.handleResponse<{ success: boolean; message: string }>(response);
  }
}

// 本地存储工具函数
export class AuthStorage {
  private static readonly ACCESS_TOKEN_KEY = "access_token";
  private static readonly TOKEN_TYPE_KEY = "token_type";
  private static readonly USER_INFO_KEY = "user_info";

  static saveLoginData(loginData: LoginResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, loginData.token.access_token);
    localStorage.setItem(this.TOKEN_TYPE_KEY, loginData.token.token_type);
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(loginData.user));
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getTokenType(): string | null {
    return localStorage.getItem(this.TOKEN_TYPE_KEY);
  }

  static getUserInfo(): User | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY);
    if (!userInfoStr) return null;

    try {
      return JSON.parse(userInfoStr) as User;
    } catch (error) {
      console.error("Failed to parse user info:", error);
      return null;
    }
  }

  static clearAuthData(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_TYPE_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }

  static isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}

// 错误处理工具
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: Error
  ) {
    super(message);
    this.name = "AuthError";
  }
}

// 常用的认证检查函数
export function requireAuth(): User {
  const userInfo = AuthStorage.getUserInfo();
  if (!userInfo) {
    throw new AuthError("User not authenticated");
  }
  return userInfo;
}

export function hasRole(requiredRole: string): boolean {
  const userInfo = AuthStorage.getUserInfo();
  return userInfo?.role === requiredRole;
}

export function hasAnyRole(requiredRoles: string[]): boolean {
  const userInfo = AuthStorage.getUserInfo();
  return userInfo ? requiredRoles.includes(userInfo.role) : false;
}