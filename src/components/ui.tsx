import { Icon } from '@/components/Icon';

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  amber: { bg: 'bg-amber2-50', text: 'text-amber2-700', border: 'border-amber2-200' },
};

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`${sizes[size]} border-3 border-sq-200 border-t-sq-600 rounded-full animate-spin`} />
      {label && <p className="text-sm text-ink-500 font-medium">{label}</p>}
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-coral-50 flex items-center justify-center">
        <Icon name="X" className="w-8 h-8 text-coral-500" />
      </div>
      <p className="text-ink-600 font-medium max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary text-sm">
          <Icon name="Play" className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center">
        <Icon name={icon} className="w-8 h-8 text-ink-400" />
      </div>
      <h3 className="text-lg font-bold text-ink-800">{title}</h3>
      <p className="text-ink-500 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface BadgeProps {
  color?: keyof typeof COLOR_MAP;
  children: React.ReactNode;
  icon?: string;
}

export function Badge({ color = 'blue', children, icon }: BadgeProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;
  return (
    <span className={`badge ${c.bg} ${c.text} ${c.border} border`}>
      {icon && <Icon name={icon} className="w-3 h-3" />}
      {children}
    </span>
  );
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="mb-6 animate-fade-in-up">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink-900 text-balance">{title}</h1>
      {subtitle && <p className="mt-2 text-ink-500 text-balance max-w-2xl">{subtitle}</p>}
      {children}
    </div>
  );
}
