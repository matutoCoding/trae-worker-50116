import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  FileText,
  MapPin,
  Calendar,
  User,
  Plus,
  Search,
  Filter,
  X,
  Image as ImageIcon,
  Cloud,
  Thermometer,
  Clock,
} from 'lucide-react';

export default function Records() {
  const { fieldRecords, projects, addFieldRecord } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState('全部');
  const [newRecord, setNewRecord] = useState({
    title: '',
    content: '',
    location: '',
    recorder: '',
    weather: '晴',
    temperature: 20,
    projectId: '1',
    images: [] as string[],
  });

  const filteredRecords = fieldRecords.filter((record) => {
    const matchesSearch =
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProject =
      projectFilter === '全部' || record.projectId === projectFilter;
    return matchesSearch && matchesProject;
  });

  const getProjectName = (projectId: string) => {
    return projects.find((p) => p.id === projectId)?.name || '未知项目';
  };

  const handleSubmit = () => {
    const record = {
      id: `fr${Date.now()}`,
      projectId: newRecord.projectId,
      title: newRecord.title,
      content: newRecord.content,
      location: newRecord.location,
      recordDate: new Date().toISOString().split('T')[0],
      recorder: newRecord.recorder,
      images: newRecord.images,
      weather: newRecord.weather,
      temperature: newRecord.temperature,
    };
    addFieldRecord(record);
    setShowModal(false);
    setNewRecord({
      title: '',
      content: '',
      location: '',
      recorder: '',
      weather: '晴',
      temperature: 20,
      projectId: '1',
      images: [],
    });
  };

  const weatherIcon = (weather: string) => {
    switch (weather) {
      case '晴':
        return '☀️';
      case '多云':
        return '⛅';
      case '阴':
        return '☁️';
      case '雨':
        return '🌧️';
      default:
        return '🌤️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">野外记录</h2>
          <p className="text-slate-500 mt-1">野外地质观察记录与图文资料管理</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          新建记录
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {fieldRecords.length}
              </p>
              <p className="text-sm text-slate-500">记录总数</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {new Set(fieldRecords.map((r) => r.location)).size}
              </p>
              <p className="text-sm text-slate-500">记录地点</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {fieldRecords.reduce((sum, r) => sum + r.images.length, 0)}
              </p>
              <p className="text-sm text-slate-500">照片资料</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {new Set(fieldRecords.map((r) => r.recorder)).size}
              </p>
              <p className="text-sm text-slate-500">记录人员</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="搜索记录标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="全部">全部项目</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <div
            key={record.id}
            onClick={() => setSelectedRecord(record)}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
              </div>
              <Badge variant="amber">
                {getProjectName(record.projectId).slice(0, 8)}...
              </Badge>
            </div>

            <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors line-clamp-1">
              {record.title}
            </h3>

            <p className="text-sm text-slate-600 mt-2 line-clamp-3">
              {record.content}
            </p>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{record.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{weatherIcon(record.weather)}</span>
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Thermometer className="w-4 h-4" />
                  <span>{record.temperature}°C</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{record.recordDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
                {record.recorder.slice(0, 1)}
              </div>
              <span className="text-xs text-slate-500">{record.recorder}</span>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">新建野外记录</h3>
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
                  记录标题
                </label>
                <input
                  type="text"
                  value={newRecord.title}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="请输入记录标题"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    地点
                  </label>
                  <input
                    type="text"
                    value={newRecord.location}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, location: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="记录地点"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    记录人
                  </label>
                  <input
                    type="text"
                    value={newRecord.recorder}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, recorder: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="记录人姓名"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    天气
                  </label>
                  <select
                    value={newRecord.weather}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, weather: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="晴">晴</option>
                    <option value="多云">多云</option>
                    <option value="阴">阴</option>
                    <option value="雨">雨</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    气温 (°C)
                  </label>
                  <input
                    type="number"
                    value={newRecord.temperature}
                    onChange={(e) =>
                      setNewRecord({
                        ...newRecord,
                        temperature: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    所属项目
                  </label>
                  <select
                    value={newRecord.projectId}
                    onChange={(e) =>
                      setNewRecord({ ...newRecord, projectId: e.target.value })
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
                  记录内容
                </label>
                <textarea
                  value={newRecord.content}
                  onChange={(e) =>
                    setNewRecord({ ...newRecord, content: e.target.value })
                  }
                  rows={6}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="请详细记录野外观察内容..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  上传照片
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer">
                  <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">点击或拖拽上传照片</p>
                  <p className="text-xs text-slate-400 mt-1">支持 JPG、PNG 格式</p>
                </div>
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

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {selectedRecord.title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {getProjectName(selectedRecord.projectId)}
                </p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {selectedRecord.location}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <User className="w-4 h-4 text-slate-400" />
                  {selectedRecord.recorder}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {selectedRecord.recordDate}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="text-lg">{weatherIcon(selectedRecord.weather)}</span>
                  {selectedRecord.weather}
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Thermometer className="w-4 h-4 text-red-400" />
                  {selectedRecord.temperature}°C
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedRecord.content}
                </p>
              </div>

              {selectedRecord.images.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3">现场照片</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedRecord.images.map((_: string, i: number) => (
                      <div
                        key={i}
                        className="aspect-square bg-slate-200 rounded-lg"
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button className="flex-1 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                编辑记录
              </button>
              <button className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                导出PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
