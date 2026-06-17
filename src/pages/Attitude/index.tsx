import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  Compass,
  MapPin,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  X,
  Layers,
  TrendingUp,
} from 'lucide-react';

export default function Attitude() {
  const { attitudes, projects, addAttitude } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [structureFilter, setStructureFilter] = useState('全部');
  const [compassAngle, setCompassAngle] = useState(125);
  const [dipAngle, setDipAngle] = useState(35);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [newAttitude, setNewAttitude] = useState({
    location: '',
    strike: 125,
    dip: 35,
    dipDirection: 215,
    rockType: '',
    structureType: '地层产状',
    observer: '',
    description: '',
    projectId: '1',
    longitude: 0,
    latitude: 0,
  });

  const filteredAttitudes = attitudes.filter((att) => {
    const matchesSearch =
      att.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      att.rockType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStructure =
      structureFilter === '全部' || att.structureType === structureFilter;
    return matchesSearch && matchesStructure;
  });

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || '未知项目';
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMeasuring) {
      interval = setInterval(() => {
        setCompassAngle((prev) => prev + (Math.random() - 0.5) * 2);
        setDipAngle((prev) => Math.max(0, Math.min(90, prev + (Math.random() - 0.5) * 1)));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isMeasuring]);

  const handleMeasure = () => {
    if (isMeasuring) {
      const strike = Math.round(((compassAngle % 360) + 360) % 360);
      const dip = Math.round(dipAngle);
      const dipDirection = Math.round(((strike + 90) % 360 + 360) % 360);
      setNewAttitude({
        ...newAttitude,
        strike,
        dip,
        dipDirection,
      });
      setIsMeasuring(false);
      setShowModal(true);
    } else {
      setIsMeasuring(true);
    }
  };

  const handleSubmit = () => {
    const attitude = {
      id: `a${Date.now()}`,
      projectId: newAttitude.projectId,
      location: newAttitude.location,
      strike: newAttitude.strike,
      dip: newAttitude.dip,
      dipDirection: newAttitude.dipDirection,
      rockType: newAttitude.rockType,
      structureType: newAttitude.structureType,
      measureDate: new Date().toISOString().split('T')[0],
      observer: newAttitude.observer,
      description: newAttitude.description,
      longitude: newAttitude.longitude,
      latitude: newAttitude.latitude,
    };
    addAttitude(attitude);
    setShowModal(false);
    setIsMeasuring(false);
  };

  const strikeStats = {
    avg: Math.round(attitudes.reduce((sum, a) => sum + a.strike, 0) / attitudes.length),
    count: attitudes.length,
  };

  const structureTypes = [...new Set(attitudes.map((a) => a.structureType))];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">产状测量</h2>
          <p className="text-slate-500 mt-1">地层产状测量与罗盘定向</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新增测量
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Compass className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {attitudes.length}
              </p>
              <p className="text-sm text-slate-500">测量总数</p>
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
                {strikeStats.avg}°
              </p>
              <p className="text-sm text-slate-500">平均走向</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {structureTypes.length}
              </p>
              <p className="text-sm text-slate-500">构造类型</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {new Set(attitudes.map((a) => a.location)).size}
              </p>
              <p className="text-sm text-slate-500">测量地点</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="搜索地点或岩性..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={structureFilter}
                onChange={(e) => setStructureFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
              >
                <option value="全部">全部类型</option>
                {structureTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      地点
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      走向
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      倾向
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      倾角
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      类型
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      岩性
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      观测者
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttitudes.map((att, index) => (
                    <tr
                      key={att.id}
                      className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          <span className="font-medium text-slate-800">
                            {att.location}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-amber-600">
                          {att.strike}°
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-700">
                          {att.dipDirection}°
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-green-600">
                          {att.dip}°
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="amber">{att.structureType}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {att.rockType}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <User className="w-4 h-4 text-slate-400" />
                          {att.observer}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-500">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {att.measureDate}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">罗盘模拟</h3>

          <div className="flex flex-col items-center">
            <div className="relative w-56 h-56">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
                <div
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200"
                  style={{ transform: `rotate(${compassAngle}deg)` }}
                >
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[16px] border-l-transparent border-r-transparent border-t-red-500"></div>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600">
                    S
                  </div>
                  <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                    W
                  </div>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                    E
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-slate-600 shadow-lg"></div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">当前走向方位</p>
              <p className="text-4xl font-bold text-amber-600 mt-1">
                {Math.round(compassAngle)}°
              </p>
            </div>

            <div className="w-full mt-6 p-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">倾角</span>
                <span className="font-semibold text-green-600">
                  {Math.round(dipAngle)}°
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                  style={{ width: `${(dipAngle / 90) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleMeasure}
              className={`w-full mt-6 py-3 rounded-lg font-medium transition-all ${
                isMeasuring
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              {isMeasuring ? '停止测量' : '开始测量'}
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-3 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              手动记录
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新增产状记录</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  测量地点
                </label>
                <input
                  type="text"
                  value={newAttitude.location}
                  onChange={(e) =>
                    setNewAttitude({ ...newAttitude, location: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="如 雪鸡坪背斜北翼"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    走向 (°)
                  </label>
                  <input
                    type="number"
                    value={newAttitude.strike}
                    onChange={(e) =>
                      setNewAttitude({
                        ...newAttitude,
                        strike: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    倾向 (°)
                  </label>
                  <input
                    type="number"
                    value={newAttitude.dipDirection}
                    onChange={(e) =>
                      setNewAttitude({
                        ...newAttitude,
                        dipDirection: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    倾角 (°)
                  </label>
                  <input
                    type="number"
                    value={newAttitude.dip}
                    onChange={(e) =>
                      setNewAttitude({
                        ...newAttitude,
                        dip: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    构造类型
                  </label>
                  <select
                    value={newAttitude.structureType}
                    onChange={(e) =>
                      setNewAttitude({
                        ...newAttitude,
                        structureType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="地层产状">地层产状</option>
                    <option value="断层产状">断层产状</option>
                    <option value="矿脉产状">矿脉产状</option>
                    <option value="节理产状">节理产状</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    岩性
                  </label>
                  <input
                    type="text"
                    value={newAttitude.rockType}
                    onChange={(e) =>
                      setNewAttitude({ ...newAttitude, rockType: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="如 大理岩"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    观测者
                  </label>
                  <input
                    type="text"
                    value={newAttitude.observer}
                    onChange={(e) =>
                      setNewAttitude({ ...newAttitude, observer: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="观测者姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    所属项目
                  </label>
                  <select
                    value={newAttitude.projectId}
                    onChange={(e) =>
                      setNewAttitude({ ...newAttitude, projectId: e.target.value })
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
                  value={newAttitude.description}
                  onChange={(e) =>
                    setNewAttitude({ ...newAttitude, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="产状特征描述..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                保存记录
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
