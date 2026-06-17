import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  Beaker,
  MapPin,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  X,
  Send,
  Package,
  Scale,
} from 'lucide-react';

export default function Sampling() {
  const { samples, projects, addSample } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [newSample, setNewSample] = useState({
    sampleNo: '',
    type: '岩石' as const,
    rockType: '',
    location: '',
    longitude: 0,
    latitude: 0,
    elevation: 0,
    collector: '',
    description: '',
    projectId: '1',
  });

  const filteredSamples = samples.filter((sample) => {
    const matchesSearch =
      sample.sampleNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sample.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === '全部' || sample.type === typeFilter;
    const matchesStatus =
      statusFilter === '全部' || sample.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已采集':
        return 'default';
      case '待送检':
        return 'warning';
      case '检测中':
        return 'info';
      case '已完成':
        return 'success';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '岩石':
        return 'default';
      case '矿石':
        return 'amber';
      case '土壤':
        return 'success';
      case '化石':
        return 'info';
      default:
        return 'default';
    }
  };

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || '未知项目';
  };

  const handleSubmit = () => {
    const sample = {
      id: `s${Date.now()}`,
      projectId: newSample.projectId,
      sampleNo: newSample.sampleNo,
      type: newSample.type,
      rockType: newSample.rockType,
      location: newSample.location,
      longitude: newSample.longitude,
      latitude: newSample.latitude,
      elevation: newSample.elevation,
      collector: newSample.collector,
      collectDate: new Date().toISOString().split('T')[0],
      description: newSample.description,
      status: '已采集' as const,
      weight: 1.5,
    };
    addSample(sample);
    setShowModal(false);
    setNewSample({
      sampleNo: '',
      type: '岩石',
      rockType: '',
      location: '',
      longitude: 0,
      latitude: 0,
      elevation: 0,
      collector: '',
      description: '',
      projectId: '1',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">岩矿采样</h2>
          <p className="text-slate-500 mt-1">管理岩矿标本采样登记和采样点坐标</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新增采样
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Beaker className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{samples.length}</p>
              <p className="text-sm text-slate-500">样品总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {samples.filter((s) => s.status === '待送检').length}
              </p>
              <p className="text-sm text-slate-500">待送检</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {samples.filter((s) => s.status === '检测中').length}
              </p>
              <p className="text-sm text-slate-500">检测中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {samples.filter((s) => s.status === '已完成').length}
              </p>
              <p className="text-sm text-slate-500">已完成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索样品编号或采样地点..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="全部">全部类型</option>
            <option value="岩石">岩石</option>
            <option value="矿石">矿石</option>
            <option value="土壤">土壤</option>
            <option value="化石">化石</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="全部">全部状态</option>
            <option value="已采集">已采集</option>
            <option value="待送检">待送检</option>
            <option value="检测中">检测中</option>
            <option value="已完成">已完成</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  样品编号
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  类型
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  岩性
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  采样地点
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  坐标
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  采集人
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  日期
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  状态
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSamples.map((sample, index) => (
                <tr
                  key={sample.id}
                  className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  }`}
                >
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800">
                      {sample.sampleNo}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getTypeColor(sample.type) as any}>
                      {sample.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">
                    {sample.rockType}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      {sample.location}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 font-mono">
                    E{sample.longitude.toFixed(2)}°<br />
                    N{sample.latitude.toFixed(2)}°
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <User className="w-4 h-4 text-slate-400" />
                      {sample.collector}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {sample.collectDate}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusColor(sample.status) as any}>
                      {sample.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                      详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新增采样登记</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    样品编号
                  </label>
                  <input
                    type="text"
                    value={newSample.sampleNo}
                    onChange={(e) =>
                      setNewSample({ ...newSample, sampleNo: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="如 JSJ-Cu-005"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    样品类型
                  </label>
                  <select
                    value={newSample.type}
                    onChange={(e) =>
                      setNewSample({
                        ...newSample,
                        type: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="岩石">岩石</option>
                    <option value="矿石">矿石</option>
                    <option value="土壤">土壤</option>
                    <option value="化石">化石</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  岩性描述
                </label>
                <input
                  type="text"
                  value={newSample.rockType}
                  onChange={(e) =>
                    setNewSample({ ...newSample, rockType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如 黄铜矿化矽卡岩"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  采样地点
                </label>
                <input
                  type="text"
                  value={newSample.location}
                  onChange={(e) =>
                    setNewSample({ ...newSample, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如 金沙江1号矿化点"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    经度
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newSample.longitude || ''}
                    onChange={(e) =>
                      setNewSample({
                        ...newSample,
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
                    value={newSample.latitude || ''}
                    onChange={(e) =>
                      setNewSample({
                        ...newSample,
                        latitude: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="27.80"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    海拔(m)
                  </label>
                  <input
                    type="number"
                    value={newSample.elevation || ''}
                    onChange={(e) =>
                      setNewSample({
                        ...newSample,
                        elevation: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="1980"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    采集人
                  </label>
                  <input
                    type="text"
                    value={newSample.collector}
                    onChange={(e) =>
                      setNewSample({ ...newSample, collector: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="采集人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    所属项目
                  </label>
                  <select
                    value={newSample.projectId}
                    onChange={(e) =>
                      setNewSample({ ...newSample, projectId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  描述
                </label>
                <textarea
                  value={newSample.description}
                  onChange={(e) =>
                    setNewSample({ ...newSample, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="样品特征描述..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                确认登记
              </button>
              <button
                onClick={() => setShowModal(false)}
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
