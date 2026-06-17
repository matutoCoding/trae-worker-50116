import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  MapPin,
  Calendar,
  User,
  Maximize2,
  Search,
  Filter,
  Plus,
  ChevronRight,
  Map as MapIcon,
  Beaker,
  Route,
  FileText,
  X,
} from 'lucide-react';
import type { Project } from '@/types';

export default function Projects() {
  const { projects, samples, routes, fieldRecords, addProject } = useStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    code: '',
    area: '',
    description: '',
    status: '待启动' as Project['status'],
    startDate: '',
    endDate: '',
    leader: '',
    longitude: 0,
    latitude: 0,
    areaSize: 0,
  });

  const handleSubmitNewProject = () => {
    const project: Project = {
      id: `p${Date.now()}`,
      name: newProject.name,
      code: newProject.code,
      area: newProject.area,
      description: newProject.description,
      status: newProject.status,
      startDate: newProject.startDate || new Date().toISOString().split('T')[0],
      endDate: newProject.endDate,
      leader: newProject.leader,
      coordinates: {
        longitude: newProject.longitude,
        latitude: newProject.latitude,
      },
      areaSize: newProject.areaSize,
    };
    addProject(project);
    setShowNewModal(false);
    setNewProject({
      name: '',
      code: '',
      area: '',
      description: '',
      status: '待启动',
      startDate: '',
      endDate: '',
      leader: '',
      longitude: 0,
      latitude: 0,
      areaSize: 0,
    });
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === '全部' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'success';
      case '已完成':
        return 'default';
      case '待启动':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getProjectStats = (projectId: string) => {
    return {
      samples: samples.filter((s) => s.projectId === projectId).length,
      routes: routes.filter((r) => r.projectId === projectId).length,
      records: fieldRecords.filter((r) => r.projectId === projectId).length,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">勘探项目</h2>
          <p className="text-slate-500 mt-1">管理所有勘探项目及区域划分</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新建项目
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索项目名称或编号..."
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
            <option value="进行中">进行中</option>
            <option value="已完成">已完成</option>
            <option value="待启动">待启动</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const stats = getProjectStats(project.id);

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <MapIcon className="w-6 h-6 text-white" />
                </div>
                <Badge variant={getStatusColor(project.status) as any}>
                  {project.status}
                </Badge>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">{project.code}</p>

              <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{project.area}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Maximize2 className="w-4 h-4" />
                  <span>{project.areaSize} km²</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{project.leader}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {project.startDate.slice(5)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">
                    {stats.samples}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Beaker className="w-3 h-3" />
                    样品
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">
                    {stats.routes}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <Route className="w-3 h-3" />
                    路线
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-800">
                    {stats.records}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3" />
                    记录
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">查看详情</span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedProject.name}
                  </h3>
                  <p className="text-slate-500 mt-1">{selectedProject.code}</p>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
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
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                <MapIcon className="w-16 h-16 text-slate-300" />
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-2">项目简介</h4>
                <p className="text-slate-600">{selectedProject.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">项目区域</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedProject.area}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">勘探面积</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedProject.areaSize} km²
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">项目负责人</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedProject.leader}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">项目状态</p>
                  <Badge variant={getStatusColor(selectedProject.status) as any} className="mt-1">
                    {selectedProject.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-800 mb-3">项目周期</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-amber-600">65%</span>
                </div>
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>开始：{selectedProject.startDate}</span>
                  <span>结束：{selectedProject.endDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-amber-50 rounded-xl text-center">
                  <Beaker className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-800">
                    {getProjectStats(selectedProject.id).samples}
                  </p>
                  <p className="text-sm text-slate-500">采集样品</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <Route className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-800">
                    {getProjectStats(selectedProject.id).routes}
                  </p>
                  <p className="text-sm text-slate-500">踏勘路线</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-center">
                  <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-800">
                    {getProjectStats(selectedProject.id).records}
                  </p>
                  <p className="text-sm text-slate-500">野外记录</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                进入项目
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                编辑信息
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新建勘探项目</h3>
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
                  项目名称 *
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) =>
                    setNewProject({ ...newProject, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如：金沙江铜多金属矿勘探项目"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    项目编号 *
                  </label>
                  <input
                    type="text"
                    value={newProject.code}
                    onChange={(e) =>
                      setNewProject({ ...newProject, code: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="如：JSJ-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    项目状态
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        status: e.target.value as Project['status'],
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="待启动">待启动</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    所在区域 *
                  </label>
                  <input
                    type="text"
                    value={newProject.area}
                    onChange={(e) =>
                      setNewProject({ ...newProject, area: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="如：云南省迪庆州"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    项目负责人
                  </label>
                  <input
                    type="text"
                    value={newProject.leader}
                    onChange={(e) =>
                      setNewProject({ ...newProject, leader: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="负责人姓名"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    经度
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProject.longitude || ''}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        longitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="99.50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    纬度
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProject.latitude || ''}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="27.80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    面积 (km²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProject.areaSize || ''}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        areaSize: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="100.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    开始日期
                  </label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, startDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    结束日期
                  </label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) =>
                      setNewProject({ ...newProject, endDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  项目描述
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="项目简介、目标任务等..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmitNewProject}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                创建项目
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
