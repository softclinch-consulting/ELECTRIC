import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Smartphone,
  Monitor,
  Briefcase,
  Truck,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Building2,
  FileCheck,
  Package,
} from 'lucide-react';
import { AppRole } from '../../types';

interface HeaderProps {
  onOpenInaiwazhi: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInaiwazhi }) => {
  const { role, setRole, activeCustomer, quotation, salesOrder, conversation } = useApp();

  const roles: { id: AppRole; label: string; icon: React.ReactNode; sublabel: string }[] = [
    {
      id: 'customer',
      label: 'Customer Mobile',
      sublabel: 'ABC Electrical (Buyer)',
      icon: <Smartphone size={16} />,
    },
    {
      id: 'admin',
      label: 'Admin Desktop',
      sublabel: 'Operations Control Tower',
      icon: <Monitor size={16} />,
    },
    {
      id: 'sales',
      label: 'Sales Desktop',
      sublabel: 'Arun Kumar (KAM)',
      icon: <Briefcase size={16} />,
    },
    {
      id: 'driver',
      label: 'Driver Mobile',
      sublabel: 'Murugan (TN-02-AK-9821)',
      icon: <Truck size={16} />,
    },
  ];

  return (
    <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Client Identity */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-md">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                TN-ELECTRA B2B
                <span className="text-[10px] bg-slate-800 text-amber-400 font-semibold px-1.5 py-0.5 rounded border border-slate-700">
                  Tamil Nadu Supply Chain
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400">
              One connected transaction: <span className="text-slate-200 font-medium">ABC Electrical</span> •{' '}
              <span className="font-mono text-blue-400 font-medium">REQ-001</span> →{' '}
              <span className="font-mono text-amber-400 font-medium">{quotation.id}</span> →{' '}
              <span className="font-mono text-emerald-400 font-medium">{salesOrder.id}</span>
            </p>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
          {roles.map((r) => {
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                id={`role-switch-${r.id}`}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {r.icon}
                <div className="text-left hidden sm:block">
                  <div className="leading-tight">{r.label}</div>
                  <div
                    className={`text-[9px] ${
                      isActive ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    {r.sublabel}
                  </div>
                </div>
                <span className="sm:hidden">{r.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action: Inaiwazhi Layer Button */}
        <div className="flex items-center gap-2">
          <button
            id="open-inaiwazhi-btn"
            onClick={onOpenInaiwazhi}
            className="inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <div className="relative">
              <MessageSquare size={16} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span>Inaiwazhi Hub</span>
            <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
              {conversation.messages.length}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
