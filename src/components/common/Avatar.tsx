import React from 'react';
import { clsx } from 'clsx';
import { getTypeColor } from '../../utils/formatters';

interface AvatarProps {
  name: string;
  initials?: string;
  type?: 'doctor' | 'nurse' | 'tech' | 'admin';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'active' | 'on-leave' | 'off-duty';
  showStatus?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  initials,
  type = 'admin',
  size = 'md',
  status,
  showStatus = false,
  className = '',
}) => {
  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayInitials = initials || getInitials(name);

  const sizeStyles: Record<string, { container: string; text: string; status: string }> = {
    sm: { container: 'w-8 h-8 rounded-lg', text: 'text-xs', status: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' },
    md: { container: 'w-12 h-12 rounded-xl', text: 'text-sm', status: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5' },
    lg: { container: 'w-16 h-16 rounded-2xl', text: 'text-lg', status: 'w-4 h-4 -bottom-1 -right-1' },
    xl: { container: 'w-20 h-20 rounded-2xl', text: 'text-xl', status: 'w-5 h-5 -bottom-1 -right-1' },
  };

  const statusColors: Record<string, string> = {
    active: '#00D26A',
    'on-leave': '#FFB020',
    'off-duty': '#6B7280',
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      <div
        className={clsx(
          'flex items-center justify-center font-bold text-white',
          sizeStyles[size].container,
          sizeStyles[size].text
        )}
        style={{
          background: getTypeColor(type),
          boxShadow: type === 'doctor'
            ? '0 4px 15px rgba(0, 102, 255, 0.3)'
            : type === 'nurse'
              ? '0 4px 15px rgba(0, 210, 106, 0.3)'
              : type === 'tech'
                ? '0 4px 15px rgba(102, 126, 234, 0.3)'
                : '0 4px 15px rgba(255, 107, 53, 0.3)',
        }}
        title={name}
      >
        {displayInitials}
      </div>

      {showStatus && status && (
        <div
          className={clsx(
            'absolute rounded-full border-2 border-amc-dark',
            sizeStyles[size].status,
            status === 'active' && 'animate-pulse'
          )}
          style={{
            backgroundColor: statusColors[status],
            boxShadow: `0 0 8px ${statusColors[status]}`,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;
