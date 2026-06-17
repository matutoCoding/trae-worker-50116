import { create } from 'zustand';
import type {
  Project,
  Route,
  Sample,
  Attitude,
  FieldRecord,
  Camp,
  SingleOperation,
  SafetyKnowledge,
  DashboardStats,
  TodoItem,
  ActivityItem,
} from '@/types';
import {
  mockProjects,
  mockRoutes,
  mockSamples,
  mockAttitudes,
  mockFieldRecords,
  mockCamps,
  mockSingleOperations,
  mockSafetyKnowledge,
  mockDashboardStats,
  mockTodoItems,
  mockActivities,
} from '@/data/mockData';

const STORAGE_KEY = 'geo-exploration-data-v1';

interface PersistedData {
  projects: Project[];
  routes: Route[];
  samples: Sample[];
  attitudes: Attitude[];
  fieldRecords: FieldRecord[];
  camps: Camp[];
  singleOperations: SingleOperation[];
  dashboardStats: DashboardStats;
  todoItems: TodoItem[];
  activities: ActivityItem[];
}

function loadFromStorage(): Partial<PersistedData> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load from localStorage:', e);
  }
  return null;
}

function saveToStorage(data: PersistedData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

const persisted = loadFromStorage();

function recalcStats(
  projects: Project[],
  samples: Sample[],
  routes: Route[],
  fieldRecords: FieldRecord[],
  camps: Camp[]
): DashboardStats {
  const pendingTests = samples.filter(
    (s) => s.status === '待送检' || s.status === '检测中'
  ).length;
  const safetyAlerts = camps.reduce((count, camp) => {
    return (
      count +
      camp.supplies.filter((s) => s.status === '不足' || s.status === '紧缺')
        .length
    );
  }, 0);

  return {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === '进行中').length,
    totalSamples: samples.length,
    totalRoutes: routes.length,
    pendingTests,
    safetyAlerts: Math.max(safetyAlerts, 0),
    completedRecords: fieldRecords.length,
    teamMembers: 18,
  };
}

interface AppState {
  projects: Project[];
  routes: Route[];
  samples: Sample[];
  attitudes: Attitude[];
  fieldRecords: FieldRecord[];
  camps: Camp[];
  singleOperations: SingleOperation[];
  safetyKnowledge: SafetyKnowledge[];
  dashboardStats: DashboardStats;
  todoItems: TodoItem[];
  activities: ActivityItem[];
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
  addProject: (project: Project) => void;
  addRoute: (route: Route) => void;
  addSample: (sample: Sample) => void;
  addAttitude: (attitude: Attitude) => void;
  addFieldRecord: (record: FieldRecord) => void;
  addCamp: (camp: Camp) => void;
  addSingleOperation: (operation: SingleOperation) => void;
  updateSampleStatus: (sampleId: string, newStatus: Sample['status']) => void;
  toggleTodo: (id: string) => void;
}

function createInitialState(): Pick<
  AppState,
  | 'projects'
  | 'routes'
  | 'samples'
  | 'attitudes'
  | 'fieldRecords'
  | 'camps'
  | 'singleOperations'
  | 'dashboardStats'
  | 'todoItems'
  | 'activities'
> {
  if (persisted) {
    return {
      projects: persisted.projects || mockProjects,
      routes: persisted.routes || mockRoutes,
      samples: persisted.samples || mockSamples,
      attitudes: persisted.attitudes || mockAttitudes,
      fieldRecords: persisted.fieldRecords || mockFieldRecords,
      camps: persisted.camps || mockCamps,
      singleOperations: persisted.singleOperations || mockSingleOperations,
      dashboardStats: persisted.dashboardStats || mockDashboardStats,
      todoItems: persisted.todoItems || mockTodoItems,
      activities: persisted.activities || mockActivities,
    };
  }
  return {
    projects: mockProjects,
    routes: mockRoutes,
    samples: mockSamples,
    attitudes: mockAttitudes,
    fieldRecords: mockFieldRecords,
    camps: mockCamps,
    singleOperations: mockSingleOperations,
    dashboardStats: mockDashboardStats,
    todoItems: mockTodoItems,
    activities: mockActivities,
  };
}

export const useStore = create<AppState>((set, get) => {
  const initial = createInitialState();
  const finalStats = recalcStats(
    initial.projects,
    initial.samples,
    initial.routes,
    initial.fieldRecords,
    initial.camps
  );

  return {
    ...initial,
    dashboardStats: finalStats,
    safetyKnowledge: mockSafetyKnowledge,
    activeProjectId: null,

    setActiveProjectId: (id) => set({ activeProjectId: id }),

    addProject: (project) =>
      set((state) => {
        const newProjects = [project, ...state.projects];
        const newStats = recalcStats(
          newProjects,
          state.samples,
          state.routes,
          state.fieldRecords,
          state.camps
        );
        saveToStorage({
          projects: newProjects,
          routes: state.routes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { projects: newProjects, dashboardStats: newStats };
      }),

    addRoute: (route) =>
      set((state) => {
        const newRoutes = [route, ...state.routes];
        const newStats = recalcStats(
          state.projects,
          state.samples,
          newRoutes,
          state.fieldRecords,
          state.camps
        );
        saveToStorage({
          projects: state.projects,
          routes: newRoutes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { routes: newRoutes, dashboardStats: newStats };
      }),

    addSample: (sample) =>
      set((state) => {
        const newSamples = [sample, ...state.samples];
        const newStats = recalcStats(
          state.projects,
          newSamples,
          state.routes,
          state.fieldRecords,
          state.camps
        );
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: newSamples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { samples: newSamples, dashboardStats: newStats };
      }),

    addAttitude: (attitude) =>
      set((state) => {
        const newAttitudes = [attitude, ...state.attitudes];
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: state.samples,
          attitudes: newAttitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: state.dashboardStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { attitudes: newAttitudes };
      }),

    addFieldRecord: (record) =>
      set((state) => {
        const newRecords = [record, ...state.fieldRecords];
        const newStats = recalcStats(
          state.projects,
          state.samples,
          state.routes,
          newRecords,
          state.camps
        );
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: newRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { fieldRecords: newRecords, dashboardStats: newStats };
      }),

    addCamp: (camp) =>
      set((state) => {
        const newCamps = [camp, ...state.camps];
        const newStats = recalcStats(
          state.projects,
          state.samples,
          state.routes,
          state.fieldRecords,
          newCamps
        );
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: newCamps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { camps: newCamps, dashboardStats: newStats };
      }),

    addSingleOperation: (operation) =>
      set((state) => {
        const newOps = [operation, ...state.singleOperations];
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: newOps,
          dashboardStats: state.dashboardStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { singleOperations: newOps };
      }),

    updateSampleStatus: (sampleId, newStatus) =>
      set((state) => {
        const newSamples = state.samples.map((s) =>
          s.id === sampleId ? { ...s, status: newStatus } : s
        );
        const newStats = recalcStats(
          state.projects,
          newSamples,
          state.routes,
          state.fieldRecords,
          state.camps
        );
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: newSamples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: newStats,
          todoItems: state.todoItems,
          activities: state.activities,
        });
        return { samples: newSamples, dashboardStats: newStats };
      }),

    toggleTodo: (id) =>
      set((state) => {
        const newTodos = state.todoItems.map((item) =>
          item.id === id ? { ...item, completed: !item.completed } : item
        );
        saveToStorage({
          projects: state.projects,
          routes: state.routes,
          samples: state.samples,
          attitudes: state.attitudes,
          fieldRecords: state.fieldRecords,
          camps: state.camps,
          singleOperations: state.singleOperations,
          dashboardStats: state.dashboardStats,
          todoItems: newTodos,
          activities: state.activities,
        });
        return { todoItems: newTodos };
      }),
  };
});
