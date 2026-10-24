import React, { useState } from "react";
import { Calendar, RefreshCw, Utensils } from "lucide-react";
import { RhythmProvider } from "./context/RhythmContext";
import HeaderBar from "./components/layout/HeaderBar";
import QuickSettingsSheet from "./components/layout/QuickSettingsSheet";
import TodayDashboard from "./components/today/TodayDashboard";
import CyclesBuilder from "./components/cycles/CyclesBuilder";
import MealPlanner from "./components/meals/MealPlanner";

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [activeSheet, setActiveSheet] = useState(null);

  const handleOpenHeaderSheet = (sheetName) => {
    // If user clicks Low or Unload while on Cycles/Meals tab, switch to Today tab first
    if ((sheetName === "restock" || sheetName === "unload") && activeTab !== "today") {
      setActiveTab("today");
    }
    setActiveSheet(sheetName);
  };

  return (
    <RhythmProvider>
      <div className="min-h-screen bg-espresso-950 flex items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-[420px] h-[100dvh] sm:h-[760px] bg-cream-100 sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col justify-between relative border border-white/10">
          
          {/* Top Bar */}
          <HeaderBar onOpenSheet={handleOpenHeaderSheet} />

          {/* Active Screen Module */}
          {activeTab === "today" && (
            <TodayDashboard activeSheet={activeSheet} setActiveSheet={setActiveSheet} />
          )}
          {activeTab === "cycles" && <CyclesBuilder />}
          {activeTab === "meals" && <MealPlanner />}

          {/* Global Settings Sheet (Meds, Birthdays, Wind-Down, Backup) */}
          <QuickSettingsSheet
            isOpen={activeSheet === "settings"}
            onClose={() => setActiveSheet(null)}
          />

          {/* Bottom Navigation Bar */}
          <nav className="px-6 py-2.5 bg-white border-t border-espresso-900/10 grid grid-cols-3 gap-2 shrink-0">
            {[
              { id: "today", label: "Today Flow", icon: Calendar },
              { id: "cycles", label: "Cycles & Rules", icon: RefreshCw },
              { id: "meals", label: "Meal Matrix", icon: Utensils }
            ].map((nav) => {
              const Icon = nav.icon;
              const isActive = activeTab === nav.id;
              return (
                <button
                  key={nav.id}
                  onClick={() => setActiveTab(nav.id)}
                  className={`flex flex-col items-center py-1 rounded-2xl transition ${
                    isActive
                      ? "text-terracotta-500 font-bold scale-105"
                      : "text-espresso-700/60 hover:text-espresso-900 font-medium"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span className="text-[10px]">{nav.label}</span>
                </button>
              );
            })}
          </nav>

        </div>
      </div>
    </RhythmProvider>
  );
}