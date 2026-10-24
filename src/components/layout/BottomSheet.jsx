import React from "react";
import { X } from "lucide-react";

export default function BottomSheet({ isOpen, onClose, title, subtitle, badge, headerClass = "bg-espresso-900", children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-espresso-950/60 backdrop-blur-xs transition-opacity">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Container locked to mobile width */}
      <div className="relative z-10 w-full max-w-[420px] max-h-[82vh] flex flex-col rounded-t-3xl bg-cream-50 shadow-sheet overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Colorful Graphic Header */}
        <div className={`${headerClass} text-cream-50 px-5 pt-3 pb-4 relative overflow-hidden`}>
          {/* Pull Handle */}
          <div className="w-10 h-1 bg-cream-200/30 rounded-full mx-auto mb-3" />

          <div className="flex items-start justify-between gap-3">
            <div>
              {badge && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-cream-100 mb-1">
                  {badge}
                </span>
              )}
              <h3 className="text-lg font-bold leading-tight">{title}</h3>
              {subtitle && <p className="text-xs text-cream-200/80 mt-0.5">{subtitle}</p>}
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Sheet Body */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}