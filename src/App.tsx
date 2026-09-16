import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MasterFlowGuide } from './components/common/MasterFlowGuide';
import { InaiwazhiDrawer } from './components/common/InaiwazhiDrawer';
import { CustomerMobileView } from './components/customer/CustomerMobileView';
import { AdminDesktopView } from './components/admin/AdminDesktopView';
import { SalesDesktopView } from './components/sales/SalesDesktopView';
import { DriverMobileView } from './components/driver/DriverMobileView';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { role, toasts, removeToast } = useApp();
  const [inaiwazhiOpen, setInaiwazhiOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* 1. Master Flow Guide Bar (Section 58 Click-Through Test) */}
      <MasterFlowGuide />

      {/* 2. Top Header with Role Switcher & Inaiwazhi Button */}
      <Header onOpenInaiwazhi={() => setInaiwazhiOpen(true)} />

      {/* 3. Main Workspace Area based on Selected Role */}
      <main className="flex-1 relative flex flex-col">
        {role === 'customer' && <CustomerMobileView />}
        {role === 'admin' && <AdminDesktopView />}
        {role === 'sales' && <SalesDesktopView />}
        {role === 'driver' && <DriverMobileView />}
      </main>

      {/* 4. Connected Communication Layer (Inaiwazhi Hub Drawer) */}
      <InaiwazhiDrawer isOpen={inaiwazhiOpen} onClose={() => setInaiwazhiOpen(false)} />

      {/* 5. Global Toast Notifications Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-3 rounded-xl shadow-lg border text-xs flex items-start gap-2.5 transition-all transform animate-in slide-in-from-right-4 ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : toast.type === 'warning'
                ? 'bg-slate-900 border-amber-500/50 text-amber-300'
                : 'bg-slate-900 border-blue-500/50 text-blue-300'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <div className="font-bold text-white leading-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
