import React from 'react';

type HeaderColor = 'blue' | 'green' | 'purple' | 'orange' | 'red';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  color?: HeaderColor;
}

export function PageHeader({ title, subtitle, icon, actions, color = 'blue' }: PageHeaderProps) {
  const colorClass = `ph-${color}`;
  return (
    <div style={{ '--header-accent-color': getAccentColor(color) } as React.CSSProperties}>
      <div className={`page-header ${colorClass}`}>
        {icon && <div className="page-icon">{icon}</div>}

        <div className="header-content">
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>

        {actions && <div className="header-actions">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;

function getAccentColor(color: string): string {
  const colorMap: Record<string, string> = {
    blue: '#3B82F6',
    green: '#10B981',
    purple: '#8B5CF6',
    orange: '#F59E0B',
    red: '#EF4444',
  };
  return colorMap[color] || '#3B82F6';
}
