import { useStore } from '@/store/useStore';
import { StatCard } from '@/components/common/StatCard';
import { Badge } from '@/components/common/Badge';
import {
  Map,
  Route,
  Beaker,
  FileText,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  ChevronRight,
  Activity,
  TrendingUp,
} from 'lucide-react';

export default function Dashboard() {
  const {
    dashboardStats,
    todoItems,
    activities,
    projects,
    samples,
    toggleTodo,
  } = useStore();

  const activeProjects = projects.filter((p) => p.status === '进行中');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="勘探项目"
          value={dashboardStats.totalProjects}
          icon={Map}
          color="amber"
          description={`${dashboardStats.activeProjects} 个进行中`}
        />
        <StatCard
          title="采集样品"
          value={dashboardStats.totalSamples}
          icon={Beaker}
          color="green"
          description={`${dashboardStats.pendingTests} 件待检测`}
        />
        <StatCard
          title="踏勘路线"
          value={dashboardStats.totalRoutes}
          icon={Route}
          color="blue"
          description="累计路线里程"
        />
        <StatCard
          title="安全预警"
          value={dashboardStats.safetyAlerts}
          icon={AlertTriangle}
          color="red"
          description="需及时处理"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">进行中项目</h3>
              <p className="text-sm text-slate-500 mt-1">当前正在执行的勘探项目</p>
            </div>
            <button className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {activeProjects.map((project) => {
              const projectSamples = samples.filter(
                (s) => s.projectId === project.id
              );
              const progress = Math.min(
                100,
                Math.round(
                  ((new Date().getTime() - new Date(project.startDate).getTime()) /
                    (new Date(project.endDate).getTime() -
                      new Date(project.startDate).getTime())) *
                    100
                )
              );

              return (
                <div
                  key={project.id}
                  className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-800">
                          {project.name}
                        </h4>
                        <Badge variant="amber">{project.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-500 mt-1">
                        {project.area} · 负责人：{project.leader}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-600">{progress}%</p>
                      <p className="text-xs text-slate-400">项目进度</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>{project.startDate}</span>
                      <span>{project.endDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Beaker className="w-4 h-4 text-amber-500" />
                      <span>{projectSamples.length} 件样品</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span>{project.areaSize} km²</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">待办事项</h3>
              <p className="text-sm text-slate-500 mt-1">
                {todoItems.filter((t) => !t.completed).length} 项待完成
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {todoItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => toggleTodo(item.id)}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-slate-300 hover:border-amber-500'
                  }`}
                >
                  {item.completed && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      item.completed
                        ? 'text-slate-400 line-through'
                        : 'text-slate-700'
                    }`}
                  >
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        item.priority === '高'
                          ? 'danger'
                          : item.priority === '中'
                          ? 'warning'
                          : 'default'
                      }
                    >
                      {item.priority}优先级
                    </Badge>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.deadline}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 py-2 text-sm text-amber-600 hover:text-amber-700 font-medium border border-dashed border-amber-300 rounded-lg hover:bg-amber-50 transition-colors">
            + 添加待办事项
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">最近动态</h3>
              <p className="text-sm text-slate-500 mt-1">团队最新工作进展</p>
            </div>
          </div>

          <div className="space-y-4">
            {activities.map((activity, index) => {
              const iconMap = {
                采样: Beaker,
                测量: Activity,
                记录: FileText,
                安全: AlertTriangle,
                系统: TrendingUp,
              };
              const Icon = iconMap[activity.type as keyof typeof iconMap] || Activity;

              const colorMap = {
                采样: 'bg-green-100 text-green-600',
                测量: 'bg-blue-100 text-blue-600',
                记录: 'bg-amber-100 text-amber-600',
                安全: 'bg-red-100 text-red-600',
                系统: 'bg-slate-100 text-slate-600',
              };

              return (
                <div key={activity.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        colorMap[activity.type as keyof typeof colorMap] ||
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-800">
                        {activity.title}
                      </p>
                      <span className="text-xs text-slate-400">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      — {activity.user}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800">团队成员</h3>
            <p className="text-sm text-slate-500 mt-1">
              共 {dashboardStats.teamMembers} 名队员
            </p>
          </div>

          <div className="space-y-4">
            {[
              { name: '张建国', role: '项目负责人', avatar: '张', color: 'from-amber-500 to-orange-600' },
              { name: '赵小刚', role: '地质工程师', avatar: '赵', color: 'from-blue-500 to-cyan-600' },
              { name: '钱进', role: '采样技术员', avatar: '钱', color: 'from-green-500 to-emerald-600' },
              { name: '李测量', role: '测量工程师', avatar: '李', color: 'from-purple-500 to-violet-600' },
              { name: '孙地质', role: '高级工程师', avatar: '孙', color: 'from-pink-500 to-rose-600' },
            ].map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-medium text-sm`}
                >
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
