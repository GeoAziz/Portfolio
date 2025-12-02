import { Badge } from './ui/badge';
import { CheckCircle2, Archive, Wrench, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProjectStatus = 'active' | 'archived' | 'maintained' | 'experimental';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    icon: CheckCircle2,
    className: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20',
  },
  archived: {
    label: 'Archived',
    icon: Archive,
    className: 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20',
  },
  maintained: {
    label: 'Maintained',
    icon: Wrench,
    className: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20',
  },
  experimental: {
    label: 'Experimental',
    icon: Sparkles,
    className: 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20',
  },
};

export function ProjectStatusBadge({ status, className }: ProjectStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1 px-2 py-0.5 text-xs font-medium transition-colors',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
