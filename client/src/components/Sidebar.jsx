import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  ClipboardList, 
  User, 
  ChevronLeft, 
  X,
  Layers
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-[#121212]/90 backdrop-blur-md border-r border-white/[0.06] flex flex-col transition-all duration-300 ease-in-out ${
          isMobile
            ? isOpen
              ? 'w-64 translate-x-0'
              : '-translate-x-full w-64'
            : isOpen
            ? 'w-64'
            : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            {(isOpen || isMobile) && (
              <span className="text-base font-bold text-white tracking-tight whitespace-nowrap">
                TaskFlow
              </span>
            )}
          </div>

          {isMobile && isOpen && (
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isMobile ? onToggle : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 shadow-inner'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`
              }
            >
              <item.icon
                className={`w-5 h-5 flex-shrink-0 ${
                  !isOpen && !isMobile ? 'mx-auto' : ''
                }`}
              />
              {(isOpen || isMobile) && (
                <span className="font-medium text-sm whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {/* Subtle indicator bar for active state */}
              {({ isActive }) =>
                isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-brand-500 shadow-[0_0_8px_#3D81E3]" />
                )
              }
            </NavLink>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        {!isMobile && (
          <div className="px-3 py-4 border-t border-white/[0.06]">
            <button
              onClick={onToggle}
              className="flex items-center justify-center w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200"
            >
              <ChevronLeft
                className={`w-5 h-5 transition-transform duration-300 ${
                  !isOpen ? 'rotate-180' : ''
                }`}
              />
              {isOpen && (
                <span className="ml-3 text-sm font-medium">Collapse</span>
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
