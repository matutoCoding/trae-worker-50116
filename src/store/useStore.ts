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
  addSample: (sample: Sample) => void;
  addAttitude: (attitude: Attitude) => void;
  addFieldRecord: (record: FieldRecord) => void;
  addSingleOperation: (operation: SingleOperation) => void;
  toggleTodo: (id: string) => void;
}

export const useStore = create<AppState>((set) => ({
  projects: mockProjects,
  routes: mockRoutes,
  samples: mockSamples,
  attitudes: mockAttitudes,
  fieldRecords: mockFieldRecords,
  camps: mockCamps,
  singleOperations: mockSingleOperations,
  safetyKnowledge: mockSafetyKnowledge,
  dashboardStats: mockDashboardStats,
  todoItems: mockTodoItems,
  activities: mockActivities,
  activeProjectId: null,

  setActiveProjectId: (id) => set({ activeProjectId: id }),

  addSample: (sample) =>
    set((state) => ({
      samples: [sample, ...state.samples],
      dashboardStats: {
        ...state.dashboardStats,
        totalSamples: state.dashboardStats.totalSamples + 1,
      },
    })),

  addAttitude: (attitude) =>
    set((state) => ({
      attitudes: [attitude, ...state.attitudes],
    })),

  addFieldRecord: (record) =>
    set((state) => ({
      fieldRecords: [record, ...state.fieldRecords],
      dashboardStats: {
        ...state.dashboardStats,
        completedRecords: state.dashboardStats.completedRecords + 1,
      },
    })),

  addSingleOperation: (operation) =>
    set((state) => ({
      singleOperations: [operation, ...state.singleOperations],
    })),

  toggleTodo: (id) =>
    set((state) => ({
      todoItems: state.todoItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    })),
}));
