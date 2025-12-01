import React, { ReactNode, useEffect } from 'react';
import { clsx } from 'clsx';
import Sidebar from './Sidebar';
import Header from './Header';
import { ParticleSystem } from '../effects/ParticleSystem';
import { MorphingShapes } from '../effects/MorphingShapes';
import { GridPattern } from '../effects/GridPattern';
import QuickAddModal from '../common/QuickAddModal';
import { useAppStore } from '../../stores/appStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { sidebarExpanded, toasts, removeToast, activeModal, closeModal } = useAppStore();

  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-amc-green" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-amc-red" />;
      default:
        return <Info className="w-5 h-5 text-amc-blue" />;
    }
  };

  return (
    <div className="min-h-screen bg-amc-dark text-white font-sans overflow-hidden relative">
      {/* Background Effects */}
      <MorphingShapes />
      <ParticleSystem />
      <GridPattern />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={clsx(
          'min-h-screen p-8 transition-all duration-300 ease-out relative z-10',
          sidebarExpanded ? 'ml-60' : 'ml-[88px]'
        )}
      >
        <Header />
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl glass-card animate-fade-in-up',
              toast.type === 'success' && 'border-amc-green/30',
              toast.type === 'error' && 'border-amc-red/30',
              toast.type === 'info' && 'border-amc-blue/30'
            )}
          >
            {getToastIcon(toast.type)}
            <span className="text-sm text-white">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-white/10 ml-2"
            >
              <X className="w-4 h-4 text-white/50" />
            </button>
          </div>
        ))}
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={activeModal === 'quick-add'}
        onClose={closeModal}
      />
    </div>
  );
};

export default MainLayout;
