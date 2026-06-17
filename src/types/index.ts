export interface Project {
  id: string;
  name: string;
  code: string;
  area: string;
  description: string;
  status: '进行中' | '已完成' | '待启动';
  startDate: string;
  endDate: string;
  leader: string;
  coordinates: {
    longitude: number;
    latitude: number;
  };
  areaSize: number;
}

export interface Route {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  status: '规划中' | '进行中' | '已完成';
  planDate: string;
  waypoints: Waypoint[];
  difficulty: '简单' | '中等' | '困难';
}

export interface Waypoint {
  id: string;
  routeId: string;
  name: string;
  longitude: number;
  latitude: number;
  elevation: number;
  sequence: number;
}

export interface Sample {
  id: string;
  projectId: string;
  sampleNo: string;
  type: '岩石' | '矿石' | '土壤' | '化石';
  rockType: string;
  location: string;
  longitude: number;
  latitude: number;
  elevation: number;
  collector: string;
  collectDate: string;
  description: string;
  status: '已采集' | '待送检' | '检测中' | '已完成';
  weight?: number;
}

export interface SampleTest {
  id: string;
  sampleId: string;
  testItem: string;
  testResult: string;
  testDate: string;
  laboratory: string;
  tester: string;
}

export interface Attitude {
  id: string;
  projectId: string;
  location: string;
  strike: number;
  dip: number;
  dipDirection: number;
  rockType: string;
  structureType: string;
  measureDate: string;
  observer: string;
  description: string;
  longitude: number;
  latitude: number;
}

export interface FieldRecord {
  id: string;
  projectId: string;
  title: string;
  content: string;
  location: string;
  recordDate: string;
  recorder: string;
  images: string[];
  weather: string;
  temperature: number;
}

export interface Camp {
  id: string;
  name: string;
  location: string;
  leader: string;
  capacity: number;
  facilities: string[];
  status: '正常' | '维护中' | '停用';
  establishedDate: string;
  contactPhone?: string;
  coordinates?: {
    longitude: number;
    latitude: number;
    elevation?: number;
  };
  supplies: SupplyItem[];
}

export interface SupplyItem {
  name: string;
  quantity: number;
  unit: string;
  status: '充足' | '不足' | '紧缺';
}

export interface SingleOperation {
  id: string;
  operator: string;
  location: string;
  task: string;
  startTime: string;
  endTime?: string;
  status: '待审批' | '进行中' | '已完成' | '已取消';
  safetyMeasures: string;
  contactPhone: string;
  reportTime: string;
}

export interface SafetyKnowledge {
  id: string;
  category: '毒蛇防护' | '蚊虫防护' | '应急处理' | '装备使用';
  title: string;
  content: string;
  severity: '一般' | '重要' | '紧急';
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalSamples: number;
  totalRoutes: number;
  pendingTests: number;
  safetyAlerts: number;
  completedRecords: number;
  teamMembers: number;
}

export interface TodoItem {
  id: string;
  title: string;
  type: '采样' | '测量' | '记录' | '安全' | '其他';
  deadline: string;
  priority: '高' | '中' | '低';
  completed: boolean;
}

export interface ActivityItem {
  id: string;
  type: '采样' | '测量' | '记录' | '安全' | '系统';
  title: string;
  description: string;
  time: string;
  user: string;
}
