import {
  CheckSquare,
  Crosshair,
  FolderKanban,
  BarChart3,
  Search,
  RotateCcw,
  Download,
  X,
} from 'lucide-react';
import { PROJECTS } from '../data/initialTasks';
import { ProjectId, Task, WorkspaceScreen } from '../types';
import { isTaskOverdue } from '../utils/taskHelpers';

interface SidebarProps {
  activeScreen: WorkspaceScreen;
  onSelectScreen: (screen: WorkspaceScreen) => void;
  selectedProjectFilter: ProjectId | 'all';
  onSelectProjectFilter: (projectId: ProjectId | 'all') => void;
  tasks: Task[];
  onOpenCommandPalette: () => void;
  onExportTasks: () => void;
  onResetDemo: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeScreen,
  onSelectScreen,
  selectedProjectFilter,
  onSelectProjectFilter,
  tasks,
  onOpenCommandPalette,
  onExportTasks,
  onResetDemo,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => isTaskOverdue(t)).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const navItems: {
    id: WorkspaceScreen;
    label: string;
    shortcut: string;
    count?: number;
    icon: typeof CheckSquare;
  }[] = [
    {
      id: WorkspaceScreen.Tasks,
      label: 'Today & Inbox',
      shortcut: '1',
      count: pendingCount,
      icon: CheckSquare,
    },
    {
      id: WorkspaceScreen.Focus,
      label: 'Focus Mode',
      shortcut: '2',
      icon: Crosshair,
    },
    {
      id: WorkspaceScreen.Projects,
      label: 'Projects',
      shortcut: '3',
      count: PROJECTS.length,
      icon: FolderKanban,
    },
    {
      id: WorkspaceScreen.Insights,
      label: 'Weekly Review',
      shortcut: '4',
      count: completedCount,
      icon: BarChart3,
    },
  ];

  const handleNavClick = (screen: WorkspaceScreen) => {
    onSelectScreen(screen);
    if (screen !== WorkspaceScreen.Tasks) {
      onSelectProjectFilter('all');
    }
    onCloseMobile();
  };

  const handleProjectShortcut = (projectId: ProjectId) => {
    onSelectScreen(WorkspaceScreen.Tasks);
    onSelectProjectFilter(selectedProjectFilter === projectId ? 'all' : projectId);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-[#FFFFFF] border-r border-[#E2E8F0] px-4 py-6">
      <div className="space-y-6">
        {/* Brand Wordmark + Mobile Close */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => handleNavClick(WorkspaceScreen.Tasks)}
            className="flex items-center gap-2.5 text-left rounded-lg py-1 pr-2 transition-colors hover:opacity-85"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-clarity-1">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[1.0625rem] font-bold tracking-[-0.02em] text-[#0F172A] whitespace-nowrap">
              Clarity
            </span>
          </button>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] lg:hidden"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Command Palette Quick Trigger */}
        <div>
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenCommandPalette();
            }}
            className="flex w-full items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-sm text-[#64748B] transition-colors hover:border-[#CBD5E1] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
          >
            <span className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
              <span className="whitespace-nowrap">Quick jump...</span>
            </span>
            <kbd className="font-mono text-[11px] font-medium text-[#64748B] tabular-nums">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Primary Workspace Navigation */}
        <nav aria-label="Workspace views" className="space-y-1">
          <div className="px-2 pb-1.5 text-xs font-medium tracking-[0.02em] text-[#64748B]">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeScreen === item.id &&
              (item.id !== WorkspaceScreen.Tasks || selectedProjectFilter === 'all');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === WorkspaceScreen.Tasks) {
                    onSelectProjectFilter('all');
                  }
                  handleNavClick(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EEF2FF] text-[#3525CD] font-semibold'
                    : 'text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8] group-hover:text-[#475569]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="truncate whitespace-nowrap">{item.label}</span>
                </span>
                <span className="flex items-center gap-2 shrink-0">
                  {typeof item.count === 'number' && (
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-[#4F46E5]' : 'text-[#94A3B8]'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Streams / Projects Quick Filter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 pb-1.5">
            <span className="text-xs font-medium tracking-[0.02em] text-[#64748B]">
              Streams
            </span>
            {selectedProjectFilter !== 'all' && (
              <button
                type="button"
                onClick={() => onSelectProjectFilter('all')}
                className="text-xs font-medium text-[#4F46E5] hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {PROJECTS.map((project) => {
            const count = tasks.filter(
              (t) => t.projectId === project.id && !t.completed
            ).length;
            const isSelected =
              activeScreen === WorkspaceScreen.Tasks &&
              selectedProjectFilter === project.id;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => handleProjectShortcut(project.id)}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm transition-colors ${
                  isSelected
                    ? 'bg-[#EEF2FF] font-semibold text-[#3525CD]'
                    : 'font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                <span className="truncate whitespace-nowrap">{project.name}</span>
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isSelected ? 'text-[#4F46E5]' : 'text-[#94A3B8]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Utilities */}
      <div className="space-y-3 border-t border-[#E2E8F0] pt-4">
        {overdueCount > 0 && (
          <button
            type="button"
            onClick={() => {
              onSelectProjectFilter('all');
              handleNavClick(WorkspaceScreen.Tasks);
            }}
            className="flex w-full items-center justify-between rounded-lg border border-[#FECDD3] bg-[#FEF2F2] px-3 py-2 text-left text-xs font-medium text-[#DC2626] transition-colors hover:bg-[#FEE2E2]"
          >
            <span>Overdue attention</span>
            <span className="font-mono font-semibold tabular-nums">{overdueCount}</span>
          </button>
        )}

        <div className="flex items-center justify-between gap-2 px-1">
          <button
            type="button"
            onClick={onExportTasks}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors whitespace-nowrap"
          >
            <Download className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors whitespace-nowrap"
          >
            <RotateCcw className="h-3.5 w-3.5 text-[#94A3B8]" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (280px) */}
      <aside className="hidden lg:block lg:w-[280px] lg:shrink-0 lg:sticky lg:top-0 lg:h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-[#0F172A]/25 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-50 w-[280px] max-w-[85vw] h-full shadow-clarity-3">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
