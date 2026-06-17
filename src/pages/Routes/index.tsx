import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  Route as RouteIcon,
  MapPin,
  Navigation,
  Calendar,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Mountain,
  TrendingUp,
  Clock,
  X,
} from 'lucide-react';
import type { Route, Waypoint } from '@/types';

export default function Routes() {
  const { routes, projects, addRoute } = useStore();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    name: '',
    projectId: '',
    description: '',
    startPoint: '',
    endPoint: '',
    planDate: '',
    distance: 0,
    status: '规划中' as Route['status'],
    difficulty: '简单' as Route['difficulty'],
    waypointName: '',
    waypointLon: '',
    waypointLat: '',
    waypointEle: '',
    waypoints: [] as Waypoint[],
  });

  const addWaypoint = () => {
    if (!newRoute.waypointName.trim()) return;
    const wp: Waypoint = {
      id: `wp${Date.now()}`,
      routeId: '',
      name: newRoute.waypointName,
      longitude: parseFloat(newRoute.waypointLon) || 0,
      latitude: parseFloat(newRoute.waypointLat) || 0,
      elevation: parseFloat(newRoute.waypointEle) || 0,
      sequence: newRoute.waypoints.length + 1,
    };
    setNewRoute({
      ...newRoute,
      waypoints: [...newRoute.waypoints, wp],
      waypointName: '',
      waypointLon: '',
      waypointLat: '',
      waypointEle: '',
    });
  };

  const removeWaypoint = (idx: number) => {
    setNewRoute({
      ...newRoute,
      waypoints: newRoute.waypoints.filter((_, i) => i !== idx),
    });
  };

  const handleSubmitNewRoute = () => {
    const route: Route = {
      id: `r${Date.now()}`,
      name: newRoute.name,
      projectId: newRoute.projectId || projects[0]?.id || '',
      description: newRoute.description,
      startPoint: newRoute.startPoint,
      endPoint: newRoute.endPoint,
      distance: newRoute.distance,
      planDate: newRoute.planDate || new Date().toISOString().split('T')[0],
      status: newRoute.status,
      difficulty: newRoute.difficulty,
      waypoints: newRoute.waypoints,
    };
    addRoute(route);
    setShowNewModal(false);
    setNewRoute({
      name: '',
      projectId: '',
      description: '',
      startPoint: '',
      endPoint: '',
      planDate: '',
      distance: 0,
      status: '规划中',
      difficulty: '简单',
      waypointName: '',
      waypointLon: '',
      waypointLat: '',
      waypointEle: '',
      waypoints: [],
    });
  };

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '全部' || route.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || '未知项目';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'success';
      case '进行中':
        return 'warning';
      case '规划中':
        return 'default';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '简单':
        return 'success';
      case '中等':
        return 'warning';
      case '困难':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">踏勘路线</h2>
          <p className="text-slate-500 mt-1">规划和管理野外踏勘路线</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新建路线
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <RouteIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{routes.length}</p>
              <p className="text-sm text-slate-500">总路线数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {routes.filter((r) => r.status === '已完成').length}
              </p>
              <p className="text-sm text-slate-500">已完成</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {routes.filter((r) => r.status === '进行中').length}
              </p>
              <p className="text-sm text-slate-500">进行中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {routes.reduce((sum, r) => sum + r.distance, 0).toFixed(1)} km
              </p>
              <p className="text-sm text-slate-500">累计里程</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索路线名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="全部">全部状态</option>
            <option value="规划中">规划中</option>
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => (
          <div
            key={route.id}
            onClick={() => setSelectedRoute(route)}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <RouteIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                    {route.name}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {getProjectName(route.projectId)}
                  </p>
                </div>
              </div>
              <Badge variant={getStatusColor(route.status) as any}>
                {route.status}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 line-clamp-2">
              {route.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mt-5">
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xl font-bold text-slate-800">
                  {route.distance} km
                </p>
                <p className="text-xs text-slate-500">路线长度</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <p className="text-xl font-bold text-slate-800">
                  {route.waypoints.length}
                </p>
                <p className="text-xs text-slate-500">途经点位</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-lg">
                <Badge variant={getDifficultyColor(route.difficulty) as any}>
                  {route.difficulty}
                </Badge>
                <p className="text-xs text-slate-500 mt-1">难度等级</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Navigation className="w-4 h-4" />
                <span>
                  {route.startPoint} → {route.endPoint}
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
              <Calendar className="w-4 h-4" />
              <span>计划日期：{route.planDate}</span>
            </div>
          </div>
        ))}
      </div>

      {selectedRoute && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedRoute.name}
                  </h3>
                  <p className="text-slate-500 mt-1">
                    {getProjectName(selectedRoute.projectId)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedRoute(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                <Mountain className="w-20 h-20 text-green-300" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.3),transparent)]"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">路线长度</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">
                    {selectedRoute.distance} km
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">难度等级</p>
                  <Badge variant={getDifficultyColor(selectedRoute.difficulty) as any} className="mt-2">
                    {selectedRoute.difficulty}
                  </Badge>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">起点</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedRoute.startPoint}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">终点</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedRoute.endPoint}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">路线描述</h4>
                <p className="text-slate-600">{selectedRoute.description}</p>
              </div>

              {selectedRoute.waypoints.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">途经点位</h4>
                  <div className="space-y-3">
                    {selectedRoute.waypoints.map((wp, index) => (
                      <div
                        key={wp.id}
                        className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{wp.name}</p>
                          <p className="text-sm text-slate-500">
                            经度 {wp.longitude}° · 纬度 {wp.latitude}° · 海拔{' '}
                            {wp.elevation}m
                          </p>
                        </div>
                        <MapPin className="w-5 h-5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                开始踏勘
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                编辑路线
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新建踏勘路线</h3>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  路线名称 *
                </label>
                <input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如：金沙江左岸A线踏勘"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  所属项目
                </label>
                <select
                  value={newRoute.projectId}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, projectId: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">请选择项目</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    起点
                  </label>
                  <input
                    type="text"
                    value={newRoute.startPoint}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, startPoint: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="起点地点"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    终点
                  </label>
                  <input
                    type="text"
                    value={newRoute.endPoint}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, endPoint: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="终点地点"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    里程(km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRoute.distance || ''}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        distance: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="5.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    状态
                  </label>
                  <select
                    value={newRoute.status}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        status: e.target.value as Route['status'],
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="规划中">规划中</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    难度
                  </label>
                  <select
                    value={newRoute.difficulty}
                    onChange={(e) =>
                      setNewRoute({
                        ...newRoute,
                        difficulty: e.target.value as Route['difficulty'],
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="简单">简单</option>
                    <option value="中等">中等</option>
                    <option value="困难">困难</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  计划日期
                </label>
                <input
                  type="date"
                  value={newRoute.planDate}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, planDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  路线描述
                </label>
                <textarea
                  value={newRoute.description}
                  onChange={(e) =>
                    setNewRoute({ ...newRoute, description: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="路线说明..."
                />
              </div>

              <div className="pt-2 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  添加途经点位
                </label>
                <div className="grid grid-cols-12 gap-2 mb-3">
                  <input
                    type="text"
                    value={newRoute.waypointName}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, waypointName: e.target.value })
                    }
                    className="col-span-4 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="点位名称"
                  />
                  <input
                    type="text"
                    value={newRoute.waypointLon}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, waypointLon: e.target.value })
                    }
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="经度"
                  />
                  <input
                    type="text"
                    value={newRoute.waypointLat}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, waypointLat: e.target.value })
                    }
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="纬度"
                  />
                  <input
                    type="text"
                    value={newRoute.waypointEle}
                    onChange={(e) =>
                      setNewRoute({ ...newRoute, waypointEle: e.target.value })
                    }
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="海拔"
                  />
                  <button
                    onClick={addWaypoint}
                    className="col-span-2 px-3 py-2 bg-slate-600 text-white rounded-lg text-sm hover:bg-slate-700 transition-colors"
                  >
                    + 添加
                  </button>
                </div>

                {newRoute.waypoints.length > 0 && (
                  <div className="space-y-2">
                    {newRoute.waypoints.map((wp, idx) => (
                      <div
                        key={wp.id}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-sm font-medium text-slate-700">
                            {wp.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {wp.longitude}°, {wp.latitude}°, {wp.elevation}m
                          </span>
                        </div>
                        <button
                          onClick={() => removeWaypoint(idx)}
                          className="text-slate-400 hover:text-red-500 text-sm"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmitNewRoute}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                创建路线
              </button>
              <button
                onClick={() => setShowNewModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
