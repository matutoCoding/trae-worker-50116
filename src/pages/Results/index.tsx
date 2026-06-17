import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Badge } from '@/components/common/Badge';
import {
  FileBarChart,
  Beaker,
  Send,
  CheckCircle,
  Clock,
  Download,
  BarChart3,
  PieChart,
  Map,
  FileText,
  Calendar,
  User,
  ChevronRight,
  Plus,
  Compass,
  Route as RouteIcon,
  Package,
  X,
} from 'lucide-react';

export default function Results() {
  const { samples, projects, attitudes, fieldRecords, routes, updateSampleStatus } = useStore();
  const [activeTab, setActiveTab] = useState('summary');
  const [exportProjectId, setExportProjectId] = useState('');

  const pendingSamples = samples.filter((s) => s.status === '待送检');
  const testingSamples = samples.filter((s) => s.status === '检测中');
  const completedSamples = samples.filter((s) => s.status === '已完成');

  const sampleTypes = ['岩石', '矿石', '土壤', '化石'];
  const typeCounts = sampleTypes.map(
    (type) => samples.filter((s) => s.type === type).length
  );

  const structureTypes = [...new Set(attitudes.map((a) => a.structureType))];

  const getSampleStatusColor = (status: string) => {
    switch (status) {
      case '已完成':
        return 'success';
      case '检测中':
        return 'info';
      case '待送检':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleExport = () => {
    if (!exportProjectId) {
      alert('请先选择要导出的项目');
      return;
    }
    const project = projects.find((p) => p.id === exportProjectId);
    if (!project) return;
    const data = {
      exportTime: new Date().toISOString(),
      project,
      samples: samples.filter((s) => s.projectId === exportProjectId),
      attitudes: attitudes.filter((a) => a.projectId === exportProjectId),
      fieldRecords: fieldRecords.filter(
        (r) => r.projectId === exportProjectId
      ),
      routes: routes.filter((r) => r.projectId === exportProjectId),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.code || project.name}-成果包-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const buildPreview = (pid: string) => {
    const projectSamples = samples.filter((s) => s.projectId === pid);
    const projectAttitudes = attitudes.filter((a) => a.projectId === pid);
    const projectRecords = fieldRecords.filter(
      (r) => r.projectId === pid
    );
    const projectRoutes = routes.filter((r) => r.projectId === pid);
    const sampleStatusSummary = {
      待送检: projectSamples.filter(
        (s) => s.status === '待送检' || s.status === '已采集'
      ).length,
      检测中: projectSamples.filter((s) => s.status === '检测中').length,
      已完成: projectSamples.filter((s) => s.status === '已完成').length,
    };
    const attitudeByType = Array.from(
      new Set(projectAttitudes.map((a) => a.structureType))
    ).map((t) => ({
      type: t,
      count: projectAttitudes.filter((a) => a.structureType === t).length,
    }));
    return {
      projectSamples,
      projectAttitudes,
      projectRecords,
      projectRoutes,
      sampleStatusSummary,
      attitudeByType,
    };
  };

  const preview = exportProjectId
    ? buildPreview(exportProjectId)
    : {
        projectSamples: [],
        projectAttitudes: [],
        projectRecords: [],
        projectRoutes: [],
        sampleStatusSummary: { 待送检: 0, 检测中: 0, 已完成: 0 },
        attitudeByType: [] as { type: string; count: number }[],
      };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">成果整理</h2>
          <p className="text-slate-500 mt-1">样品送检管理与勘探成果汇总</p>
        </div>
        <button
          onClick={() => setActiveTab('export')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium shadow-sm"
        >
          <Download className="w-5 h-5" />
          导出成果包
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
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Send className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {pendingSamples.length}
              </p>
              <p className="text-sm text-slate-500">待送检</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {testingSamples.length}
              </p>
              <p className="text-sm text-slate-500">检测中</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {completedSamples.length}
              </p>
              <p className="text-sm text-slate-500">已完成</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100">
          <nav className="flex">
            {[
              { id: 'summary', label: '成果汇总', icon: BarChart3 },
              { id: 'testing', label: '样品送检', icon: Beaker },
              { id: 'report', label: '报告管理', icon: FileBarChart },
              { id: 'export', label: '成果导出', icon: Package },
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
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-amber-500" />
                    样品类型分布
                  </h3>
                  <div className="space-y-3">
                    {sampleTypes.map((type, index) => {
                      const count = typeCounts[index];
                      const percentage = samples.length > 0
                        ? (count / samples.length) * 100
                        : 0;
                      const colors = [
                        'bg-slate-400',
                        'bg-amber-500',
                        'bg-green-500',
                        'bg-blue-500',
                      ];
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{type}</span>
                            <span className="font-medium text-slate-800">
                              {count} 件 ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[index]} rounded-full`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 bg-slate-50 rounded-xl">
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-green-500" />
                    产状构造类型统计
                  </h3>
                  <div className="space-y-3">
                    {structureTypes.map((type) => {
                      const count = attitudes.filter(
                        (a) => a.structureType === type
                      ).length;
                      const maxCount = Math.max(
                        ...structureTypes.map(
                          (t) =>
                            attitudes.filter((a) => a.structureType === t).length
                        )
                      );
                      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      return (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-600">{type}</span>
                            <span className="font-medium text-slate-800">
                              {count} 处
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-500" />
                  项目成果概览
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => {
                    const projectSamples = samples.filter(
                      (s) => s.projectId === project.id
                    );
                    const projectAttitudes = attitudes.filter(
                      (a) => a.projectId === project.id
                    );
                    const projectRecords = fieldRecords.filter(
                      (r) => r.projectId === project.id
                    );

                    return (
                      <div
                        key={project.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-800">
                              {project.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              {project.code}
                            </p>
                          </div>
                          <Badge variant="amber">{project.status}</Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                          <div className="text-center">
                            <p className="text-xl font-bold text-amber-600">
                              {projectSamples.length}
                            </p>
                            <p className="text-xs text-slate-500">样品</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-green-600">
                              {projectAttitudes.length}
                            </p>
                            <p className="text-xs text-slate-500">产状</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-blue-600">
                              {projectRecords.length}
                            </p>
                            <p className="text-xs text-slate-500">记录</p>
                          </div>
                        </div>

                        <button className="w-full mt-4 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium border border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-1">
                          查看详情 <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">
                      生成勘探成果报告
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      自动汇总项目数据，生成标准化的地质勘探成果报告，支持PDF和Word格式导出
                    </p>
                  </div>
                  <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors flex-shrink-0">
                    立即生成
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-slate-800">样品送检管理</h3>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  批量送检
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-amber-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">待送检样品</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {pendingSamples.length} 件
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Beaker className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">检测中</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {testingSamples.length} 件
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">已完成检测</p>
                      <p className="text-2xl font-bold text-green-600">
                        {completedSamples.length} 件
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
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
                          采样地点
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
                      {samples.map((sample, index) => (
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
                            <Badge variant="amber">{sample.type}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-600">
                            {sample.location}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <User className="w-4 h-4 text-slate-400" />
                              {sample.collector}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5 text-sm text-slate-500">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {sample.collectDate}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={getSampleStatusColor(sample.status) as any}>
                              {sample.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {(sample.status === '已采集' ||
                                sample.status === '待送检') && (
                                <button
                                  onClick={() =>
                                    updateSampleStatus(sample.id, '检测中')
                                  }
                                  className="text-xs px-2.5 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors font-medium"
                                >
                                  送检
                                </button>
                              )}
                              {sample.status === '检测中' && (
                                <button
                                  onClick={() =>
                                    updateSampleStatus(sample.id, '已完成')
                                  }
                                  className="text-xs px-2.5 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded-md transition-colors font-medium"
                                >
                                  登记完成
                                </button>
                              )}
                              <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                                详情
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800">成果报告</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: '金沙江铜多金属矿勘探项目阶段性报告',
                    date: '2024-05-20',
                    type: '阶段性报告',
                    status: '已完成',
                  },
                  {
                    name: '秦岭西段金矿普查设计书',
                    date: '2024-04-15',
                    type: '设计书',
                    status: '已完成',
                  },
                  {
                    name: '华北平原煤炭资源调查报告',
                    date: '2024-02-28',
                    type: '最终报告',
                    status: '已完成',
                  },
                  {
                    name: '藏北高原锂矿调查可行性报告',
                    date: '2024-06-01',
                    type: '可行性报告',
                    status: '编制中',
                  },
                ].map((report, index) => (
                  <div
                    key={index}
                    className="p-5 bg-slate-50 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                        <FileBarChart className="w-6 h-6 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 truncate">
                          {report.name}
                        </h4>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="amber">{report.type}</Badge>
                          <span className="text-sm text-slate-500">
                            {report.date}
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={report.status === '已完成' ? 'success' : 'warning'}
                      >
                        {report.status}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-200">
                      <button className="flex-1 py-2 text-sm text-amber-600 hover:bg-amber-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-1">
                        <Download className="w-4 h-4" />
                        下载
                      </button>
                      <button className="flex-1 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                        查看
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button className="w-full py-3 text-amber-600 hover:text-amber-700 font-medium border-2 border-dashed border-amber-300 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  新建报告
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Package className="w-5 h-5 text-amber-600" />
                      按项目导出成果包
                    </h3>
                    <p className="text-sm text-slate-600 mt-1.5">
                      选择要导出的勘探项目，系统将汇总样品送检状态、产状统计、野外记录和路线概览，生成JSON格式成果包
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <select
                      value={exportProjectId}
                      onChange={(e) => setExportProjectId(e.target.value)}
                      className="min-w-[240px] px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
                    >
                      <option value="">请选择项目...</option>
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}（{p.code}）
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleExport}
                      disabled={!exportProjectId}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      导出成果包
                    </button>
                  </div>
                </div>
              </div>

              {!exportProjectId ? (
                <div className="p-12 bg-slate-50 rounded-xl text-center">
                  <Package className="w-14 h-14 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">
                    请在上方选择要导出的勘探项目，预览数据后即可导出
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-5 bg-white rounded-xl border border-slate-200">
                    <h4 className="font-semibold text-slate-800 mb-4">
                      数据概览
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-green-50 rounded-xl text-center">
                        <RouteIcon className="w-6 h-6 text-green-600 mx-auto mb-1.5" />
                        <p className="text-2xl font-bold text-slate-800">
                          {preview.projectRoutes.length}
                        </p>
                        <p className="text-xs text-slate-500">踏勘路线</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl text-center">
                        <Beaker className="w-6 h-6 text-amber-600 mx-auto mb-1.5" />
                        <p className="text-2xl font-bold text-slate-800">
                          {preview.projectSamples.length}
                        </p>
                        <p className="text-xs text-slate-500">采集样品</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-xl text-center">
                        <Compass className="w-6 h-6 text-purple-600 mx-auto mb-1.5" />
                        <p className="text-2xl font-bold text-slate-800">
                          {preview.projectAttitudes.length}
                        </p>
                        <p className="text-xs text-slate-500">产状测量</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl text-center">
                        <FileText className="w-6 h-6 text-blue-600 mx-auto mb-1.5" />
                        <p className="text-2xl font-bold text-slate-800">
                          {preview.projectRecords.length}
                        </p>
                        <p className="text-xs text-slate-500">野外记录</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Beaker className="w-4 h-4 text-amber-500" />
                        样品送检状态
                      </h4>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="p-3 bg-amber-50 rounded-lg text-center">
                          <p className="text-xl font-bold text-amber-600">
                            {preview.sampleStatusSummary.待送检}
                          </p>
                          <p className="text-xs text-slate-500">待送检</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <p className="text-xl font-bold text-blue-600">
                            {preview.sampleStatusSummary.检测中}
                          </p>
                          <p className="text-xs text-slate-500">检测中</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <p className="text-xl font-bold text-green-600">
                            {preview.sampleStatusSummary.已完成}
                          </p>
                          <p className="text-xs text-slate-500">已完成</p>
                        </div>
                      </div>
                      {preview.projectSamples.length === 0 ? (
                        <div className="py-6 text-center text-sm text-slate-400">
                          暂无样品数据
                        </div>
                      ) : (
                        <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
                          {preview.projectSamples.slice(0, 10).map((s) => (
                            <div
                              key={s.id}
                              className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-sm"
                            >
                              <div>
                                <span className="font-mono text-xs text-slate-600">
                                  {s.sampleNo}
                                </span>
                                <span className="text-slate-400 mx-2">·</span>
                                <span className="text-slate-700">{s.type}</span>
                              </div>
                              <Badge
                                variant={getSampleStatusColor(s.status) as any}
                              >
                                {s.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-purple-500" />
                        产状统计
                      </h4>
                      {preview.projectAttitudes.length === 0 ? (
                        <div className="py-10 text-center text-sm text-slate-400">
                          暂无产状数据
                        </div>
                      ) : (
                        <>
                          <div className="space-y-2.5 mb-5">
                            {preview.attitudeByType.map((t) => {
                              const max = Math.max(
                                ...preview.attitudeByType.map(
                                  (x) => x.count
                                ),
                                1
                              );
                              return (
                                <div key={t.type}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600">
                                      {t.type}
                                    </span>
                                    <span className="font-medium text-slate-800">
                                      {t.count} 处
                                    </span>
                                  </div>
                                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                                      style={{
                                        width: `${
                                          (t.count / max) * 100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-400">走向均值</p>
                              <p className="mt-1 font-bold text-slate-800">
                                {preview.projectAttitudes.length > 0
                                  ? Math.round(
                                      preview.projectAttitudes.reduce(
                                        (s, a) => s + a.strike,
                                        0
                                      ) / preview.projectAttitudes.length
                                    )
                                  : 0}
                                °
                              </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-400">倾角均值</p>
                              <p className="mt-1 font-bold text-slate-800">
                                {preview.projectAttitudes.length > 0
                                  ? Math.round(
                                      preview.projectAttitudes.reduce(
                                        (s, a) => s + a.dip,
                                        0
                                      ) / preview.projectAttitudes.length
                                    )
                                  : 0}
                                °
                              </p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-lg">
                              <p className="text-xs text-slate-400">类型数</p>
                              <p className="mt-1 font-bold text-slate-800">
                                {preview.attitudeByType.length}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        野外记录
                      </h4>
                      {preview.projectRecords.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-400">
                          暂无野外记录
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                          {preview.projectRecords.slice(0, 8).map((r) => (
                            <div
                              key={r.id}
                              className="p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-800">
                                  {r.title}
                                </p>
                                <span className="text-xs text-slate-400">
                                  {r.recordDate?.slice(5, 10)}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {r.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="p-5 bg-white rounded-xl border border-slate-200">
                      <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <RouteIcon className="w-4 h-4 text-green-500" />
                        踏勘路线概览
                      </h4>
                      {preview.projectRoutes.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-400">
                          暂无踏勘路线
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-[260px] overflow-y-auto">
                          {preview.projectRoutes.map((r) => (
                            <div
                              key={r.id}
                              className="p-3 bg-slate-50 rounded-lg"
                            >
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-800">
                                  {r.name}
                                </p>
                                <Badge
                                  variant={
                                    r.status === '进行中'
                                      ? 'success'
                                      : r.status === '已完成'
                                      ? 'default'
                                      : 'warning'
                                  }
                                >
                                  {r.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {r.startPoint || '起点'} →{' '}
                                {r.endPoint || '终点'} · {r.distance || 0} km ·{' '}
                                {r.planDate}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
