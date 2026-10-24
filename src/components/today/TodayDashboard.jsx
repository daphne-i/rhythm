import React, { useState } from "react";
import {
  Sparkles,
  Utensils,
  Pill,
  Clock,
  CheckCircle2,
  Circle,
  ShoppingCart,
  Home,
  BookOpen,
  Zap,
  Sun,
  Sunset,
  Moon,
  Plus,
  Trash2
} from "lucide-react";
import { useRhythm } from "../../context/RhythmContext";
import {
  resolveRoutineForDate,
  resolveMealsAndPrepForDate,
  resolveDueHomeResets
} from "../../utils/cycleEngine";
import BottomSheet from "../layout/BottomSheet";

export default function TodayDashboard({ activeSheet, setActiveSheet }) {
  const {
    state,
    selectedDate,
    activeTimeWindow,
    setActiveTimeWindow,
    toggleRitualStep,
    toggleLowStock,
    updateMedStatus,
    completeHomeReset,
    addMindUnloadTask,
    toggleMindUnloadTask,
    deleteMindUnloadTask
  } = useRhythm();

  const [selectedRitualTab, setSelectedRitualTab] = useState("face");
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskWindow, setNewTaskWindow] = useState(activeTimeWindow);

  // 1. Resolve Today's Logs & Routines
  const dayLog = state.dailyLogs[selectedDate] || { completedSteps: [], medStatus: {} };

  const faceRule =
    activeTimeWindow === "Night"
      ? state.routineRules.face_pm
      : state.routineRules.face_am;

  const resolvedFace = resolveRoutineForDate(faceRule, selectedDate, state.shelfItems, dayLog.completedSteps);
  const resolvedHair = resolveRoutineForDate(state.routineRules.hair_care, selectedDate, state.shelfItems, dayLog.completedSteps);
  const resolvedBody = resolveRoutineForDate(state.routineRules.body_care, selectedDate, state.shelfItems, dayLog.completedSteps);
  const resolvedMove = resolveRoutineForDate(state.routineRules.workout, selectedDate, state.shelfItems, dayLog.completedSteps);

  const ritualMap = {
    face: resolvedFace,
    hair: resolvedHair,
    body: resolvedBody,
    move: resolvedMove
  };

  const totalRitualSteps =
    resolvedFace.totalCount + resolvedHair.totalCount + resolvedBody.totalCount + resolvedMove.totalCount;
  const completedRitualSteps =
    resolvedFace.doneCount + resolvedHair.doneCount + resolvedBody.doneCount + resolvedMove.doneCount;
  const ritualPercent = totalRitualSteps > 0 ? Math.round((completedRitualSteps / totalRitualSteps) * 100) : 0;

  // 2. Resolve Today's Meals & Cross-Day Prep
  const mealInfo = resolveMealsAndPrepForDate(state, selectedDate);
  const activeMeal =
    activeTimeWindow === "Morning"
      ? { label: "Breakfast", dish: mealInfo.todayMeals.bfast, next: mealInfo.todayMeals.lunch.name }
      : activeTimeWindow === "Afternoon"
      ? { label: "Lunch & Snack", dish: mealInfo.todayMeals.lunch, next: mealInfo.todayMeals.snack.name }
      : { label: "Dinner", dish: mealInfo.todayMeals.dinner, next: `Tomorrow: ${mealInfo.tomorrowWeekday}` };

  // 3. Resolve Active Time-Window Flow Items (Tablets, Home Resets, Prep, Wind-Down)
  const windowMeds = state.medications.filter((m) => m.timeWindow === activeTimeWindow);
  const dueResets = resolveDueHomeResets(state.intervalTrackers, selectedDate);
  const windowTasks = state.mindUnload.filter((t) => t.timeWindow === activeTimeWindow);

  const activeRoutine = ritualMap[selectedRitualTab];

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-2.5 overflow-hidden select-none">
      {/* 1. TIME-OF-DAY WINDOW SWITCHER */}
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-cream-200/70 border border-espresso-900/5 shrink-0">
        {[
          { id: "Morning", label: "Morning", icon: Sun },
          { id: "Afternoon", label: "Afternoon", icon: Sunset },
          { id: "Night", label: "Night", icon: Moon }
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTimeWindow === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTimeWindow(tab.id);
                setNewTaskWindow(tab.id);
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                active
                  ? "bg-espresso-900 text-cream-50 shadow-xs"
                  : "text-espresso-700 hover:text-espresso-900"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? "text-amber-500" : "opacity-70"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. GRAPHIC BENTO SUMMARY ROW (2 Side-by-Side Tactile Cards) */}
      <div className="grid grid-cols-2 gap-3 my-2.5 shrink-0">
        {/* LEFT BENTO: SELF-CARE & RITUALS */}
        <button
          onClick={() => setActiveSheet("rituals")}
          className={`text-left p-3.5 rounded-3xl text-cream-50 shadow-bento relative overflow-hidden transition transform active:scale-[0.98] ${
            activeTimeWindow === "Night"
              ? "bento-plum-night"
              : resolvedHair.isHighlight
              ? "bento-hair-wash"
              : "bento-ritual-gradient"
          }`}
        >
          <Sparkles className="w-20 h-20 text-white/5 absolute -right-4 -bottom-4 pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 text-cream-100">
              {activeTimeWindow === "Night" ? "PM Rituals" : "AM Rituals"}
            </span>

            {/* SVG Mini Progress Ring */}
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg className="w-7 h-7 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/15"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-amber-500 transition-all duration-300"
                  strokeDasharray={`${ritualPercent}, 100`}
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9px] font-bold">{completedRitualSteps}/{totalRitualSteps}</span>
            </div>
          </div>

          <h3 className="text-sm font-bold leading-snug truncate">
            {resolvedFace.cycleLabel}
          </h3>

          {/* Category Status Mini Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 font-medium">
              😊 Face {resolvedFace.doneCount}/{resolvedFace.totalCount}
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-lg font-semibold ${
                resolvedHair.isHighlight
                  ? "bg-amber-500 text-espresso-950"
                  : "bg-white/10 text-cream-100"
              }`}
            >
              💆‍♀️ {resolvedHair.isHighlight ? "Wash Day!" : "Hair"}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 font-medium">
              🧴 Body {resolvedBody.doneCount}/{resolvedBody.totalCount}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 font-medium">
              🏋️‍♀️ {resolvedMove.cycleLabel.split(" ")[0]}
            </span>
          </div>
        </button>

        {/* RIGHT BENTO: TODAY'S PLATE & PREP */}
        <button
          onClick={() => setActiveSheet("meals")}
          className="text-left p-3.5 rounded-3xl bento-meal-gradient text-cream-50 shadow-bento relative overflow-hidden transition transform active:scale-[0.98] flex flex-col justify-between"
        >
          <Utensils className="w-20 h-20 text-white/5 absolute -right-4 -bottom-4 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 text-cream-100">
                {activeMeal.label}
              </span>
              <span className="text-base">{activeMeal.dish.emoji}</span>
            </div>

            <h3 className="text-sm font-bold leading-snug line-clamp-2">
              {activeMeal.dish.name}
            </h3>
            <p className="text-[11px] text-cream-100/80 mt-0.5 truncate">
              Next: {activeMeal.next}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-100 shrink-0" />
            <span className="text-[10px] font-semibold text-amber-100 truncate">
              {mealInfo.nightPrepAlerts.length > 0
                ? `Tonight: ${mealInfo.nightPrepAlerts[0].text}`
                : mealInfo.morningPrepAlerts.length > 0
                ? `Today: ${mealInfo.morningPrepAlerts[0].text}`
                : "All meal prep on track"}
            </span>
          </div>
        </button>
      </div>

      {/* 3. ACTIVE WINDOW FLOW (Fits Bottom Half with Zero Scroll) */}
      <div className="flex-1 bg-white/80 border border-espresso-900/10 rounded-3xl p-3.5 shadow-bento flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-terracotta-500" />
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-espresso-800">
              {activeTimeWindow} Flow & Anchors
            </h4>
          </div>
        
        </div>

        {/* Dynamic Flow Cards */}
        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto no-scrollbar py-0.5">
          {/* A. Meal-Linked Medications for this Window */}
          {windowMeds.map((med) => {
            const status = dayLog.medStatus?.[med.id];
            const isTaken = status === "taken";
            const isSnoozed = status === "snoozed";

            return (
              <div
                key={med.id}
                className={`p-2.5 rounded-2xl border flex items-center justify-between transition ${
                  isTaken
                    ? "bg-olive-100/70 border-olive-500/30 text-espresso-700"
                    : "bg-amber-100/60 border-amber-500/30 text-espresso-900"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`p-2 rounded-xl ${isTaken ? "bg-olive-500 text-white" : "bg-terracotta-500 text-white"}`}>
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isTaken ? "line-through opacity-60" : ""}`}>
                        {med.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-espresso-900/10 font-semibold">
                        {med.mealTag}
                      </span>
                    </div>
                    <p className="text-[10px] text-espresso-700/80 font-medium">
                      {isSnoozed ? "⏳ Snoozed +30m (Waiting for meal)" : `Scheduled • ${med.time}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {!isTaken && (
                    <button
                      onClick={() => updateMedStatus(med.id, "snoozed")}
                      className="px-2 py-1 rounded-xl bg-white border border-espresso-900/15 text-[10px] font-bold text-espresso-800 hover:bg-cream-100"
                      title="Haven't eaten yet (+30m)"
                    >
                      🍽️ +30m
                    </button>
                  )}
                  <button
                    onClick={() => updateMedStatus(med.id, isTaken ? null : "taken")}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
                      isTaken
                        ? "bg-olive-600 text-white"
                        : "bg-espresso-900 text-cream-50 hover:bg-espresso-800"
                    }`}
                  >
                    {isTaken ? "✓ Taken" : "Take"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* B. Morning or Night Kitchen Prep Alert */}
          {activeTimeWindow === "Morning" &&
            mealInfo.morningPrepAlerts.map((prep) => (
              <div
                key={prep.id}
                className="p-2.5 rounded-2xl bg-terracotta-100/70 border border-terracotta-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-terracotta-500 text-white">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-espresso-900">{prep.text}</p>
                    <p className="text-[10px] text-terracotta-600 font-semibold">
                      Kitchen Prep • For {prep.forDish}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {activeTimeWindow === "Night" &&
            mealInfo.nightPrepAlerts.map((prep) => (
              <div
                key={prep.id}
                className="p-2.5 rounded-2xl bg-terracotta-100/70 border border-terracotta-500/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-terracotta-500 text-white">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-espresso-900">{prep.text}</p>
                    <p className="text-[10px] text-terracotta-600 font-semibold">
                      Night-Before Prep • {prep.forDish}
                    </p>
                  </div>
                </div>
              </div>
            ))}

          {/* C. Due Home Reset Tracker */}
          {activeTimeWindow === "Afternoon" &&
            dueResets.map((reset) => (
              <div
                key={reset.id}
                className="p-2.5 rounded-2xl bg-teal-100/70 border border-teal-600/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-teal-600 text-white">
                    <Home className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-espresso-900">{reset.title}</p>
                    <p className="text-[10px] text-teal-600 font-semibold">
                      Home Reset Cycle • Every {reset.intervalDays} days
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => completeHomeReset(reset.id)}
                  className="px-2.5 py-1 rounded-xl bg-teal-600 text-white text-[10px] font-bold"
                >
                  Done
                </button>
              </div>
            ))}

          {/* D. Flexible Tasks for this Window */}
          {windowTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleMindUnloadTask(task.id)}
              className="p-2.5 rounded-2xl bg-cream-100 border border-espresso-900/10 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {task.done ? (
                  <CheckCircle2 className="w-4 h-4 text-olive-600 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-espresso-700/50 shrink-0" />
                )}
                <span className={`text-xs font-semibold truncate ${task.done ? "line-through opacity-50" : "text-espresso-900"}`}>
                  {task.text}
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-espresso-900/5 text-espresso-700 font-medium shrink-0">
                Task
              </span>
            </div>
          ))}

          {/* E. Evening Wind-Down & Hobbies Slot (Night Window) */}
          {activeTimeWindow === "Night" && state.windDownSlot?.title && (
            <div className="p-2.5 rounded-2xl bg-plum-100/80 border border-plum-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-plum-600 text-white">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-espresso-900">
                    {state.windDownSlot.title}
                  </p>
                  <p className="text-[10px] text-plum-600 font-semibold">
                    🌙 {state.windDownSlot.tag}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Footer Hint inside Flow Box */}
        <div className="pt-1.5 border-t border-espresso-900/5 flex items-center justify-between text-[10px] text-espresso-700/70 shrink-0">
          <span>Tap Rituals or Meal cards above for full checklists</span>
          <button
            onClick={() => setActiveSheet("unload")}
            className="font-bold text-terracotta-600 hover:underline"
          >
            + Add to Flow
          </button>
        </div>
      </div>

      {/* =========================================================
          SLIDE-UP BOTTOM SHEET 1: RITUALS & SELF-CARE HUB
      ========================================================= */}
      <BottomSheet
        isOpen={activeSheet === "rituals"}
        onClose={() => setActiveSheet(null)}
        badge={`${activeTimeWindow} Self-Care Hub`}
        title={activeRoutine.cycleLabel}
        subtitle="Tap a step to mark applied, or tap the cart icon if running low."
        headerClass={
          selectedRitualTab === "hair" && resolvedHair.isHighlight
            ? "bento-hair-wash"
            : activeTimeWindow === "Night"
            ? "bento-plum-night"
            : "bento-ritual-gradient"
        }
      >
        <div className="grid grid-cols-4 gap-1.5 bg-cream-200/70 p-1 rounded-2xl mb-3">
          {[
            { id: "face", label: "Face", emoji: "😊", data: resolvedFace },
            { id: "hair", label: "Hair", emoji: "💆‍♀️", data: resolvedHair },
            { id: "body", label: "Body", emoji: "🧴", data: resolvedBody },
            { id: "move", label: "Move", emoji: "🏋️‍♀️", data: resolvedMove }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedRitualTab(cat.id)}
              className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center transition ${
                selectedRitualTab === cat.id
                  ? "bg-espresso-900 text-cream-50 shadow-xs"
                  : "text-espresso-700 hover:bg-white/50"
              }`}
            >
              <span>{cat.emoji} {cat.label}</span>
              <span className="text-[10px] opacity-75">
                {cat.data.doneCount}/{cat.data.totalCount}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {activeRoutine.steps.map((step, idx) => (
            <div
              key={step.stepLogKey}
              className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                step.done
                  ? "bg-olive-100/60 border-olive-500/30"
                  : "bg-white border-espresso-900/10"
              }`}
            >
              <button
                onClick={() => toggleRitualStep(step.stepLogKey)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                    step.done
                      ? "bg-olive-600 text-white"
                      : "bg-cream-200 text-espresso-800"
                  }`}
                >
                  {step.done ? "✓" : idx + 1}
                </span>
                <div>
                  <p className={`text-sm font-bold ${step.done ? "line-through opacity-60" : "text-espresso-900"}`}>
                    {step.name}
                  </p>
                  <p className="text-[11px] text-espresso-700/70">
                    Step {idx + 1} of {activeRoutine.totalCount}
                  </p>
                </div>
              </button>

              {selectedRitualTab !== "move" && (
                <button
                  onClick={() => toggleLowStock(step.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1 transition ${
                    step.isLowStock
                      ? "bg-terracotta-500 text-white"
                      : "bg-cream-100 text-espresso-700 hover:bg-cream-200"
                  }`}
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>{step.isLowStock ? "Low" : "Stock OK"}</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* =========================================================
          SLIDE-UP BOTTOM SHEET 2: TODAY'S 4-QUADRANT MEAL PLATE
      ========================================================= */}
      <BottomSheet
        isOpen={activeSheet === "meals"}
        onClose={() => setActiveSheet(null)}
        badge={`${mealInfo.todayWeekday}'s Full Menu`}
        title="Today's 4-Meal Plate & Prep"
        subtitle="Auto-synced with your Weekly Meal Matrix"
        headerClass="bento-meal-gradient"
      >
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { key: "bfast", label: "🌅 Breakfast", dish: mealInfo.todayMeals.bfast },
            { key: "lunch", label: "☀️ Lunch", dish: mealInfo.todayMeals.lunch },
            { key: "snack", label: "☕ Snacks", dish: mealInfo.todayMeals.snack },
            { key: "dinner", label: "🌙 Dinner", dish: mealInfo.todayMeals.dinner }
          ].map((slot) => (
            <div
              key={slot.key}
              className="p-3 rounded-2xl bg-white border border-espresso-900/10 shadow-2xs"
            >
              <span className="text-[10px] font-bold uppercase text-terracotta-600">
                {slot.label}
              </span>
              <div className="mt-1 flex items-center gap-1.5">
                <span className="text-lg">{slot.dish.emoji}</span>
                <p className="text-xs font-bold text-espresso-900 leading-snug">
                  {slot.dish.name}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 p-3 rounded-2xl bg-amber-100/70 border border-amber-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-espresso-900">
            <Zap className="w-4 h-4 text-terracotta-500" />
            <span>Auto-Generated Kitchen Prep Alerts</span>
          </div>
          {mealInfo.morningPrepAlerts.length === 0 && mealInfo.nightPrepAlerts.length === 0 ? (
            <p className="text-xs text-espresso-700">No advance soaking or thawing needed today!</p>
          ) : (
            <>
              {mealInfo.morningPrepAlerts.map((p) => (
                <p key={p.id} className="text-xs text-espresso-800 font-medium">
                  • <strong>Morning:</strong> {p.text} <em>({p.forDish})</em>
                </p>
              ))}
              {mealInfo.nightPrepAlerts.map((p) => (
                <p key={p.id} className="text-xs text-espresso-800 font-medium">
                  • <strong>Tonight (9 PM):</strong> {p.text} <em>({p.forDish})</em>
                </p>
              ))}
            </>
          )}
        </div>
      </BottomSheet>

      {/* =========================================================
          SLIDE-UP BOTTOM SHEET 3: RUNNING LOW / RESTOCK LIST
      ========================================================= */}
      <BottomSheet
        isOpen={activeSheet === "restock"}
        onClose={() => setActiveSheet(null)}
        badge="Smart Inventory"
        title="Running Low & Restock List"
        subtitle="Items you flagged [🛒 Low] during your daily rituals"
      >
        {Object.values(state.shelfItems).filter((i) => i.isLowStock).length === 0 ? (
          <p className="text-xs text-center py-6 text-espresso-700">
            All skincare, haircare, and body care items are well stocked!
          </p>
        ) : (
          Object.values(state.shelfItems)
            .filter((i) => i.isLowStock)
            .map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl bg-white border border-espresso-900/10 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-espresso-900">{item.name}</p>
                  <p className="text-[10px] uppercase font-semibold text-terracotta-600">
                    {item.category} shelf
                  </p>
                </div>
                <button
                  onClick={() => toggleLowStock(item.id)}
                  className="px-3 py-1.5 rounded-xl bg-olive-600 text-white text-xs font-bold"
                >
                  ✓ Restocked
                </button>
              </div>
            ))
        )}
      </BottomSheet>

      {/* =========================================================
          SLIDE-UP BOTTOM SHEET 4: MIND UNLOAD (BRAIN DUMP)
      ========================================================= */}
      <BottomSheet
        isOpen={activeSheet === "unload"}
        onClose={() => setActiveSheet(null)}
        badge="Brain Dump Inbox"
        title="Mind Unload Drawer"
        subtitle="Get random errands & plans out of your head and into a time block"
      >
        <div className="space-y-2 mb-3">
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Unload a task or thought..."
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-medium focus:outline-none focus:border-terracotta-500"
            />
            <button
              onClick={() => {
                if (!newTaskText.trim()) return;
                addMindUnloadTask(newTaskText.trim(), newTaskWindow);
                setNewTaskText("");
              }}
              className="px-3 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          {/* Choose which time window this task belongs to */}
          <div className="grid grid-cols-3 gap-1">
            {["Morning", "Afternoon", "Night"].map((w) => (
              <button
                key={w}
                onClick={() => setNewTaskWindow(w)}
                className={`py-1 rounded-xl text-[10px] font-bold transition ${
                  newTaskWindow === w
                    ? "bg-espresso-900 text-cream-50"
                    : "bg-cream-200/70 text-espresso-700"
                }`}
              >
                Assign to {w}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {state.mindUnload.length === 0 ? (
            <p className="text-xs text-center py-4 text-espresso-700/70">
              Your mind is clear! No unloaded tasks pending.
            </p>
          ) : (
            state.mindUnload.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-2xl bg-white border border-espresso-900/10 flex items-center justify-between"
              >
                <div
                  onClick={() => toggleMindUnloadTask(t.id)}
                  className="flex-1 cursor-pointer flex items-center justify-between pr-2 min-w-0"
                >
                  <span className={`text-xs font-bold truncate ${t.done ? "line-through opacity-50" : "text-espresso-900"}`}>
                    {t.text}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-lg bg-cream-200 font-semibold text-espresso-800 shrink-0 ml-2">
                    {t.timeWindow}
                  </span>
                </div>
                <button
                  onClick={() => deleteMindUnloadTask(t.id)}
                  className="p-1.5 rounded-xl text-espresso-700/50 hover:text-terracotta-600 hover:bg-terracotta-100/50 transition shrink-0"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </BottomSheet>
    </div>
  );
}