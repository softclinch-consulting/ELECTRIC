import React from 'react';
import { useApp, MASTER_FLOW_STEPS } from '../../context/AppContext';
import {
  ChevronRight,
  ChevronLeft,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Monitor,
  Briefcase,
  Truck,
  Layers,
} from 'lucide-react';

export const MasterFlowGuide: React.FC = () => {
  const {
    currentFlowStep,
    setFlowStep,
    goToNextFlowStep,
    guidedMode,
    setGuidedMode,
    resetPrototypeState,
    role,
    setRole,
  } = useApp();

  const activeStep = MASTER_FLOW_STEPS.find((s) => s.id === currentFlowStep) || MASTER_FLOW_STEPS[0];

  const getRoleIcon = (roleName: string) => {
    switch (roleName) {
      case 'customer':
        return <Smartphone size={14} className="text-amber-500" />;
      case 'admin':
        return <Monitor size={14} className="text-blue-500" />;
      case 'sales':
        return <Briefcase size={14} className="text-emerald-500" />;
      case 'driver':
        return <Truck size={14} className="text-purple-500" />;
      default:
        return <Layers size={14} />;
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'customer':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'driver':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Step Indicator & Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs shadow-xs">
              {activeStep.id}
            </span>
            <span className="text-xs text-slate-400 font-medium">of 14</span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-white truncate max-w-md">
                {activeStep.title}
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${getRoleBadge(
                  activeStep.role
                )}`}
              >
                {getRoleIcon(activeStep.role)}
                <span className="uppercase tracking-wider">{activeStep.role} VIEW</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate max-w-xl mt-0.5">
              💡 <strong className="text-amber-300">Action:</strong> {activeStep.expectedAction}
            </p>
          </div>
        </div>

        {/* Step Controls */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {/* Direct Step Jump Selector */}
          <select
            id="flow-step-selector"
            value={currentFlowStep}
            onChange={(e) => setFlowStep(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {MASTER_FLOW_STEPS.map((step) => (
              <option key={step.id} value={step.id}>
                Step {step.id}: {step.role.toUpperCase()} — {step.title.split(':')[1]?.trim() || step.title}
              </option>
            ))}
          </select>

          {/* Prev Button */}
          <button
            id="flow-prev-btn"
            disabled={currentFlowStep <= 1}
            onClick={() => setFlowStep(currentFlowStep - 1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition"
            title="Previous Step"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Next Step Primary CTA */}
          <button
            id="flow-next-btn"
            onClick={goToNextFlowStep}
            className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            <span>Next Journey Step</span>
            <ChevronRight size={14} />
          </button>

          {/* Reset button */}
          <button
            id="flow-reset-btn"
            onClick={resetPrototypeState}
            title="Reset to Initial Data"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
