import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Route,
  Beaker,
  Compass,
  FileText,
  ShieldAlert,
  FileBarChart,
  Mountain,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/projects', label: '项目区域', icon: Map },
  { path: '/routes', label: '踏勘路线', icon: Route },
  { path: '/sampling', label: '岩矿采样', icon: Beaker },
  { path: '/attitude', label: '产状测量', icon: Compass },
  { path: '/records', label: '野外记录', icon: FileText },
  { path: '/safety', label: '安全管理', icon: ShieldAlert },
  { path: '/results', label: '成果整理', icon: FileBarChart },
];

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-slate-800 text-white transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center flex-shrink-0">
            <Mountain className="w-6 h-6 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold leading-tight">地质勘探</h1>
              <p className="text-xs text-slate-400">野外作业管理系统</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold">
              张
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">张建国</p>
              <p className="text-xs text-slate-400 truncate">项目负责人</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold">
              张
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
