import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  Paperclip,
  X,
  FileText,
  CheckCircle,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

interface InaiwazhiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InaiwazhiDrawer: React.FC<InaiwazhiDrawerProps> = ({ isOpen, onClose }) => {
  const { conversation, sendInaiwazhiMessage, quotation, requirement, salesOrder, role, activeCustomer } = useApp();
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendInaiwazhiMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickAction = (actionPrompt: string) => {
    sendInaiwazhiMessage(actionPrompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div
        id="inaiwazhi-drawer-panel"
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header with Context Banner (Section 49) */}
        <div className="bg-slate-900 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/40">
                IW
              </div>
              <div>
                <h3 className="font-semibold text-base flex items-center gap-1.5">
                  Inaiwazhi Communication Hub
                  <span className="text-[10px] bg-emerald-600 px-1.5 py-0.5 rounded text-white uppercase font-bold tracking-wider">
                    Live Layer
                  </span>
                </h3>
                <p className="text-xs text-slate-300">Cross-system connected transaction communication</p>
              </div>
            </div>
            <button
              id="inaiwazhi-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Context Details Card - Mandated in Section 49 */}
          <div className="mt-3 bg-slate-800/90 rounded-lg p-2.5 text-xs space-y-1.5 border border-slate-700">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Linked Customer:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">{activeCustomer.name}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Current Record:</span>
              <div className="flex items-center gap-1">
                <span className="bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-mono font-medium">
                  {quotation.id} / {requirement.id}
                </span>
                {salesOrder.status !== 'Draft' && (
                  <span className="bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded font-mono font-medium">
                    {salesOrder.id}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Assigned Sales:</span>
              <span className="text-emerald-400 font-medium">{activeCustomer.assignedSalesName || 'Arun Kumar'}</span>
            </div>
            <div className="pt-1 border-t border-slate-700/60 flex justify-between items-center">
              <span className="text-slate-400">Current Status:</span>
              <span className="text-amber-400 font-medium text-[11px] truncate max-w-[210px]">
                {conversation.currentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {conversation.messages.map((msg) => {
            const isSystem = msg.senderRole === 'system';
            const isMe =
              (role === 'customer' && msg.senderRole === 'customer') ||
              (role === 'sales' && msg.senderRole === 'sales') ||
              (role === 'admin' && msg.senderRole === 'admin') ||
              (role === 'driver' && msg.senderRole === 'driver');

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center my-2">
                  <div className="inline-flex items-center gap-1 text-[11px] bg-slate-200/80 text-slate-700 px-3 py-1 rounded-full border border-slate-300">
                    <ShieldCheck size={12} className="text-blue-600" />
                    <span>{msg.text}</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-500">
                  <User size={10} />
                  <span>{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  {msg.attachmentName && (
                    <div
                      className={`mt-2 flex items-center gap-2 p-2 rounded-lg text-[11px] ${
                        isMe
                          ? 'bg-blue-700/50 text-blue-100 border border-blue-500/50'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <FileText size={14} className={isMe ? 'text-blue-200' : 'text-blue-600'} />
                      <span className="font-medium truncate flex-1">{msg.attachmentName}</span>
                      <span className="text-[10px] uppercase opacity-75 font-mono">
                        {msg.attachmentType || 'PDF'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Chips (Section 10) */}
        <div className="p-2 bg-white border-t border-slate-200 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-thin">
          <button
            onClick={() => handleQuickAction('Please update me on delivery dispatch status for Ambattur Site.')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition shrink-0"
          >
            📦 Ask About Order
          </button>
          <button
            onClick={() => handleQuickAction('Can we get a revision on the cable quantity or pricing?')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition shrink-0"
          >
            📋 Ask About Quotation
          </button>
          <button
            onClick={() => handleQuickAction('Uploading revised site line single-line diagram (SLD).')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition shrink-0"
          >
            📎 Send Document
          </button>
          <button
            onClick={() => handleQuickAction('Requesting direct call with Arun Kumar for payment terms.')}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition shrink-0"
          >
            📞 Contact Sales
          </button>
        </div>

        {/* Input area */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <button
            type="button"
            title="Attach BOQ / Specs"
            onClick={() => {
              sendInaiwazhiMessage('Attached technical site diagram and BOQ spec sheet.', 'Site_Spec_Addendum.pdf', 'boq');
            }}
            className="p-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
          >
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            id="inaiwazhi-msg-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type message or question..."
            className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          <button
            type="submit"
            id="inaiwazhi-send-btn"
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
