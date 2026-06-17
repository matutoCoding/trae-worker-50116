import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  ShieldAlert,
  Tent,
  UserCheck,
  Bug,
  AlertTriangle,
  Plus,
  X,
  Phone,
  MapPin,
  Clock,
  Users,
  Package,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import type { Camp } from '@/types';

export default function Safety() {
  const { camps, singleOperations, safetyKnowledge, addSingleOperation, addCamp } = useStore();
  const [activeTab, setActiveTab] = useState('camp');
  const [showOperationModal, setShowOperationModal] = useState(false);
  const [showCampModal, setShowCampModal] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [newOperation, setNewOperation] = useState({
    operator: '',
    location: '',
    task: '',
    startTime: '',
    safetyMeasures: '',
    contactPhone: '',
  });
  const [newCamp, setNewCamp] = useState({
    name: '',
    location: '',
    leader: '',
    capacity: 0,
    establishDate: '',
    contactPhone: '',
    longitude: 0,
    latitude: 0,
    elevation: 0,
  });

  const handleSubmitCamp = () => {
    const camp: Camp = {
      id: `c${Date.now()}`,
      name: newCamp.name,
      location: newCamp.location,
      leader: newCamp.leader,
      capacity: newCamp.capacity,
      establishedDate: newCamp.establishDate || new Date().toISOString().split('T')[0],
      contactPhone: newCamp.contactPhone,
      status: '正常',
      coordinates: {
        longitude: newCamp.longitude,
        latitude: newCamp.latitude,
        elevation: newCamp.elevation,
      },
      facilities: [],
      supplies: [],
    };
    addCamp(camp);
    setShowCampModal(false);
    setNewCamp({
      name: '',
      location: '',
      leader: '',
      capacity: 0,
      establishDate: '',
      contactPhone: '',
      longitude: 0,
      latitude: 0,
      elevation: 0,
    });
  };

  const handleSubmitOperation = () => {
    const operation = {
      id: `so${Date.now()}`,
      operator: newOperation.operator,
      location: newOperation.location,
      task: newOperation.task,
      startTime: newOperation.startTime,
      status: '待审批' as const,
      safetyMeasures: newOperation.safetyMeasures,
      contactPhone: newOperation.contactPhone,
      reportTime: new Date().toISOString(),
    };
    addSingleOperation(operation);
    setShowOperationModal(false);
    setNewOperation({
      operator: '',
      location: '',
      task: '',
      startTime: '',
      safetyMeasures: '',
      contactPhone: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '正常':
      case '已完成':
        return 'success';
      case '进行中':
        return 'warning';
      case '待审批':
      case '维护中':
        return 'info';
      case '停用':
      case '已取消':
        return 'default';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case '紧急':
        return 'danger';
      case '重要':
        return 'warning';
      case '一般':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSupplyStatusColor = (status: string) => {
    switch (status) {
      case '充足':
        return 'text-green-500';
      case '不足':
        return 'text-amber-500';
      case '紧缺':
        return 'text-red-500';
      default:
        return 'text-slate-500';
    }
  };

  const categories = [
    { id: '毒蛇防护', label: '毒蛇防护', icon: '🐍' },
    { id: '蚊虫防护', label: '蚊虫防护', icon: '🦟' },
    { id: '应急处理', label: '应急处理', icon: '🚑' },
    { id: '装备使用', label: '装备使用', icon: '🎒' },
  ];

  const knowledgeByCategory = (category: string) => {
    return safetyKnowledge.filter((k) => k.category === category);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">安全管理</h2>
          <p className="text-slate-500 mt-1">野外作业安全管理与防护知识</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Tent className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{camps.length}</p>
              <p className="text-sm text-slate-500">野外营地</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {singleOperations.filter((o) => o.status === '进行中').length}
              </p>
              <p className="text-sm text-slate-500">独头作业</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bug className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {safetyKnowledge.length}
              </p>
              <p className="text-sm text-slate-500">安全知识</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">2</p>
              <p className="text-sm text-slate-500">安全预警</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="border-b border-slate-100">
          <nav className="flex">
            {[
              { id: 'camp', label: '营地管理', icon: Tent },
              { id: 'operation', label: '独头作业', icon: UserCheck },
              { id: 'protection', label: '防护知识', icon: ShieldAlert },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'camp' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">野外营地</h3>
                <button
                  onClick={() => setShowCampModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  新增营地
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {camps.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-5 bg-slate-50 rounded-xl hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <Tent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {camp.name}
                          </h4>
                          <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {camp.location}
                          </div>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(camp.status) as any}>
                        {camp.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Users className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-800">
                          {camp.capacity}
                        </p>
                        <p className="text-xs text-slate-500">容纳人数</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <Package className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-800">
                          {camp.facilities.length}
                        </p>
                        <p className="text-xs text-slate-500">设施数量</p>
                      </div>
                      <div className="text-center p-3 bg-white rounded-lg">
                        <UserCheck className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                        <p className="text-lg font-bold text-slate-800">
                          {camp.leader}
                        </p>
                        <p className="text-xs text-slate-500">负责人</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        物资储备
                      </p>
                      <div className="space-y-2">
                        {camp.supplies.slice(0, 3).map((supply, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-sm"
                          >
                            <span className="text-slate-600">{supply.name}</span>
                            <span className={getSupplyStatusColor(supply.status)}>
                              {supply.quantity} {supply.unit} · {supply.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedCamp(camp)}
                      className="w-full mt-4 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium border border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-1"
                    >
                      查看详情 <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'operation' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">
                  独头作业报备
                </h3>
                <button
                  onClick={() => setShowOperationModal(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  提交报备
                </button>
              </div>

              <div className="space-y-3">
                {singleOperations.map((op) => (
                  <div
                    key={op.id}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            op.status === '进行中'
                              ? 'bg-green-100 text-green-600'
                              : op.status === '待审批'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {op.status === '进行中' ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : op.status === '待审批' ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Info className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">
                            {op.operator}
                          </h4>
                          <p className="text-sm text-slate-500">{op.task}</p>
                        </div>
                      </div>
                      <Badge variant={getStatusColor(op.status) as any}>
                        {op.status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        {op.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {op.startTime}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-green-500" />
                        {op.contactPhone}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'protection' && (
            <div className="space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 whitespace-nowrap transition-colors"
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safetyKnowledge.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedKnowledge(item)}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {item.category === '毒蛇防护'
                            ? '🐍'
                            : item.category === '蚊虫防护'
                            ? '🦟'
                            : item.category === '应急处理'
                            ? '🚑'
                            : '🎒'}
                        </span>
                        <div>
                          <h4 className="font-medium text-slate-800 group-hover:text-amber-600 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(item.severity) as any}>
                        {item.severity}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showOperationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">独头作业报备</h3>
              <button
                onClick={() => setShowOperationModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    作业人员
                  </label>
                  <input
                    type="text"
                    value={newOperation.operator}
                    onChange={(e) =>
                      setNewOperation({ ...newOperation, operator: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="作业人员姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={newOperation.contactPhone}
                    onChange={(e) =>
                      setNewOperation({ ...newOperation, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="联系方式"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  作业地点
                </label>
                <input
                  type="text"
                  value={newOperation.location}
                  onChange={(e) =>
                    setNewOperation({ ...newOperation, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="作业地点"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  作业任务
                </label>
                <input
                  type="text"
                  value={newOperation.task}
                  onChange={(e) =>
                    setNewOperation({ ...newOperation, task: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="作业内容描述"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  计划开始时间
                </label>
                <input
                  type="datetime-local"
                  value={newOperation.startTime}
                  onChange={(e) =>
                    setNewOperation({ ...newOperation, startTime: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  安全措施
                </label>
                <textarea
                  value={newOperation.safetyMeasures}
                  onChange={(e) =>
                    setNewOperation({ ...newOperation, safetyMeasures: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="请描述安全保障措施..."
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-700">
                  独头作业必须报备，且至少每2小时与营地联系一次。紧急情况请拨打救援电话。
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmitOperation}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                提交报备
              </button>
              <button
                onClick={() => setShowOperationModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedKnowledge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {selectedKnowledge.category === '毒蛇防护'
                    ? '🐍'
                    : selectedKnowledge.category === '蚊虫防护'
                    ? '🦟'
                    : selectedKnowledge.category === '应急处理'
                    ? '🚑'
                    : '🎒'}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedKnowledge.title}
                  </h3>
                  <p className="text-sm text-slate-500">{selectedKnowledge.category}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedKnowledge(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <Badge variant={getSeverityColor(selectedKnowledge.severity) as any}>
                  {selectedKnowledge.severity}
                </Badge>
              </div>

              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedKnowledge.content}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100">
              <button
                onClick={() => setSelectedKnowledge(null)}
                className="w-full py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                我已了解
              </button>
            </div>
          </div>
        </div>
      )}

      {showCampModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新增野外营地</h3>
              <button
                onClick={() => setShowCampModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  营地名称 *
                </label>
                <input
                  type="text"
                  value={newCamp.name}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如：金沙江1号营地"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  营地位置 *
                </label>
                <input
                  type="text"
                  value={newCamp.location}
                  onChange={(e) =>
                    setNewCamp({ ...newCamp, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如：云南省迪庆州金沙江东岸"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    营地负责人
                  </label>
                  <input
                    type="text"
                    value={newCamp.leader}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, leader: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="负责人姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    容纳人数
                  </label>
                  <input
                    type="number"
                    value={newCamp.capacity || ''}
                    onChange={(e) =>
                      setNewCamp({
                        ...newCamp,
                        capacity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="如：20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={newCamp.contactPhone}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="营地电话"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    建立日期
                  </label>
                  <input
                    type="date"
                    value={newCamp.establishDate}
                    onChange={(e) =>
                      setNewCamp({ ...newCamp, establishDate: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                    value={newCamp.longitude || ''}
                    onChange={(e) =>
                      setNewCamp({
                        ...newCamp,
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
                    value={newCamp.latitude || ''}
                    onChange={(e) =>
                      setNewCamp({
                        ...newCamp,
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
                    value={newCamp.elevation || ''}
                    onChange={(e) =>
                      setNewCamp({
                        ...newCamp,
                        elevation: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="2500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmitCamp}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                创建营地
              </button>
              <button
                onClick={() => setShowCampModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCamp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Tent className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedCamp.name}
                  </h3>
                  <p className="text-slate-500 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> {selectedCamp.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getStatusColor(selectedCamp.status) as any}
                >
                  {selectedCamp.status}
                </Badge>
                <button
                  onClick={() => setSelectedCamp(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">营地负责人</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedCamp.leader || '—'}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">容纳人数</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedCamp.capacity} 人
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">建立日期</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedCamp.establishedDate}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">联系电话</p>
                  <p className="font-medium text-slate-800 mt-1">
                    {selectedCamp.contactPhone || '—'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500 mb-2">坐标信息</p>
                <div className="flex gap-6 text-sm text-slate-700">
                  <span>
                    经度：
                    <b className="text-slate-800">
                      {selectedCamp.coordinates.longitude}°
                    </b>
                  </span>
                  <span>
                    纬度：
                    <b className="text-slate-800">
                      {selectedCamp.coordinates.latitude}°
                    </b>
                  </span>
                  <span>
                    海拔：
                    <b className="text-slate-800">
                      {selectedCamp.coordinates.elevation}m
                    </b>
                  </span>
                </div>
              </div>

              {selectedCamp.facilities.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">配套设施</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCamp.facilities.map((f, idx) => (
                      <Badge key={idx} variant="default">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCamp.supplies.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">物资储备</h4>
                  <div className="space-y-2">
                    {selectedCamp.supplies.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {s.name}
                        </span>
                        <span
                          className={`text-sm ${getSupplyStatusColor(s.status)}`}
                        >
                          {s.quantity} {s.unit} · {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                编辑信息
              </button>
              <button
                onClick={() => setSelectedCamp(null)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
