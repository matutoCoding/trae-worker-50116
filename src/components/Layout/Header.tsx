import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  onToggleSidebar?: () => void;
}

export function Header({ title, onToggleSidebar }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索..."
            className="w-64 pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">通知</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">新的独头作业申请</p>
                  <p className="text-xs text-slate-500 mt-1">孙地质 提交了作业申请</p>
                  <p className="text-xs text-slate-400 mt-1">10 分钟前</p>
                </div>
                <div className="p-4 hover:bg-slate-50 border-b border-slate-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">样品检测完成</p>
                  <p className="text-xs text-slate-500 mt-1">JSJ-Cu-001 检测报告已出</p>
                  <p className="text-xs text-slate-400 mt-1">2 小时前</p>
                </div>
                <div className="p-4 hover:bg-slate-50 cursor-pointer">
                  <p className="text-sm font-medium text-slate-800">安全提醒</p>
                  <p className="text-xs text-slate-500 mt-1">急救药品库存不足</p>
                  <p className="text-xs text-slate-400 mt-1">昨天</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded-lg transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-sm font-bold text-white">
            张
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-slate-800">张建国</p>
            <p className="text-xs text-slate-500">项目负责人</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
