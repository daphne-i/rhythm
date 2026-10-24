import React, { useState } from "react";
import {
  RefreshCw,
  CalendarDays,
  Plus,
  X,
  Sparkles,
  Home,
  Check,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2
} from "lucide-react";
import { useRhythm } from "../../context/RhythmContext";
import BottomSheet from "../layout/BottomSheet";

const RULE_TABS = [
  { id: "face_pm", label: "Face PM", emoji: "🌙", category: "face" },
  { id: "face_am", label: "Face AM", emoji: "☀️", category: "face" },
  { id: "hair_care", label: "Hair", emoji: "💆‍♀️", category: "hair" },
  { id: "body_care", label: "Body", emoji: "🧴", category: "body" },
  { id: "workout", label: "Move", emoji: "🏋️‍♀️", category: "move" },
  { id: "home_resets", label: "Home", emoji: "🏠", category: "home" }
];

const WEEKDAY_BUTTONS = [
  { dayNum: 1, label: "M" },
  { dayNum: 2, label: "T" },
  { dayNum: 3, label: "W" },
  { dayNum: 4, label: "T" },
  { dayNum: 5, label: "F" },
  { dayNum: 6, label: "S" },
  { dayNum: 0, label: "S" }
];

export default function CyclesBuilder() {
  const {
    state,
    updateRoutineRule,
    addShelfItem,
    deleteShelfItem,
    updateHomeResetInterval,
    addHomeResetTracker,
    deleteHomeResetTracker,
    completeHomeReset
  } = useRhythm();

  const [selectedRuleId, setSelectedRuleId] = useState("face_pm");
  const [selectedCycleKey, setSelectedCycleKey] = useState(null);
  const [isDeletingShelf, setIsDeletingShelf] = useState(false);

  // Modals & Inline Edit States
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
  const [cycleModalMode, setCycleModalMode] = useState("rename"); // "rename" | "create"
  const [cycleLabelInput, setCycleLabelInput] = useState("");

  const [newChipName, setNewChipName] = useState("");
  const [newResetTitle, setNewResetTitle] = useState("");
  const [newResetDays, setNewResetDays] = useState("7");

  const activeTabMeta = RULE_TABS.find((t) => t.id === selectedRuleId);

  // =================================================================
  // HOME RESETS TAB (Interval Counter Engine)
  // =================================================================
  if (selectedRuleId === "home_resets") {
    return (
      <div className="flex-1 flex flex-col justify-between px-4 py-2.5 overflow-hidden select-none">
        <div className="grid grid-cols-6 gap-1 bg-cream-200/70 p-1 rounded-2xl shrink-0">
          {RULE_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedRuleId(t.id);
                setSelectedCycleKey(null);
              }}
              className={`py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center transition ${
                selectedRuleId === t.id
                  ? "bg-espresso-900 text-cream-50 shadow-xs"
                  : "text-espresso-700 hover:bg-white/60"
              }`}
            >
              <span>{t.emoji}</span>
              <span className="truncate max-w-full px-0.5">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="my-2 p-3.5 rounded-3xl bento-hair-wash text-cream-50 shadow-bento relative overflow-hidden shrink-0">
          <Home className="w-16 h-16 text-white/10 absolute -right-2 -bottom-2" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15">
            Drift-Aware Intervals
          </span>
          <h3 className="text-sm font-bold mt-1">Home & Appliance Reset Cycles</h3>
          <p className="text-[11px] text-cream-100/80">
            Stays 100% hidden on Today&apos;s screen until the exact day it is due.
          </p>
        </div>

        <div className="flex-1 bg-white/85 border border-espresso-900/10 rounded-3xl p-3 shadow-bento flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 space-y-2 overflow-y-auto no-scrollbar pr-0.5">
            {state.intervalTrackers.map((tracker) => (
              <div
                key={tracker.id}
                className="p-2.5 rounded-2xl bg-cream-50 border border-espresso-900/10 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-bold text-espresso-900 truncate">
                    {tracker.title}
                  </p>
                  <p className="text-[10px] text-espresso-700/70 font-medium">
                    Last reset: {tracker.lastCompletedDate}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() =>
                      updateHomeResetInterval(tracker.id, tracker.intervalDays - 1)
                    }
                    className="w-6 h-6 rounded-lg bg-cream-200 text-espresso-900 font-bold text-xs"
                  >
                    -
                  </button>
                  <span className="text-[11px] font-extrabold text-teal-600 px-1">
                    {tracker.intervalDays}d
                  </span>
                  <button
                    onClick={() =>
                      updateHomeResetInterval(tracker.id, tracker.intervalDays + 1)
                    }
                    className="w-6 h-6 rounded-lg bg-cream-200 text-espresso-900 font-bold text-xs"
                  >
                    +
                  </button>
                  <button
                    onClick={() => completeHomeReset(tracker.id)}
                    className="ml-1 px-2 py-1 rounded-xl bg-teal-600 text-white text-[10px] font-bold"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => deleteHomeResetTracker(tracker.id)}
                    className="p-1 rounded-lg text-espresso-700/50 hover:text-terracotta-600 transition"
                    title="Delete reset tracker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-espresso-900/10 flex gap-1.5 mt-2 shrink-0">
            <input
              type="text"
              value={newResetTitle}
              onChange={(e) => setNewResetTitle(e.target.value)}
              placeholder="New reset (e.g. Wash Makeup Brushes)..."
              className="flex-1 px-2.5 py-1.5 rounded-xl bg-cream-100 border border-espresso-900/15 text-xs focus:outline-none"
            />
            <input
              type="number"
              value={newResetDays}
              onChange={(e) => setNewResetDays(e.target.value)}
              className="w-12 px-2 py-1.5 rounded-xl bg-cream-100 border border-espresso-900/15 text-xs font-bold text-center"
            />
            <button
              onClick={() => {
                if (!newResetTitle.trim()) return;
                addHomeResetTracker(newResetTitle.trim(), Number(newResetDays));
                setNewResetTitle("");
              }}
              className="px-3 py-1.5 rounded-xl bg-espresso-900 text-cream-50 text-xs font-bold"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // STANDARD ROUTINE RULE ENGINE (Face, Hair, Body, Move)
  // =================================================================
  const rule = state.routineRules[selectedRuleId];
  const cycleKeys = Object.keys(rule.cycles);
  const activeCycleId =
    selectedCycleKey && rule.cycles[selectedCycleKey]
      ? selectedCycleKey
      : cycleKeys[0];
  const activeCycle = rule.cycles[activeCycleId];

  const categoryShelfItems = Object.values(state.shelfItems).filter(
    (item) => item.category === activeTabMeta.category
  );

  // Helper to build or read the 7-day map { 0: cycleKey, 1: cycleKey, ... }
  const getCurrentWeekdayMap = () => {
    if (rule.weekdayMap) return rule.weekdayMap;
    const map = {};
    const primary = rule.activeCycleId || cycleKeys[0];
    const fallback = rule.defaultCycleId || cycleKeys[1] || cycleKeys[0];
    [0, 1, 2, 3, 4, 5, 6].forEach((d) => {
      map[d] = (rule.activeWeekdays || []).includes(d) ? primary : fallback;
    });
    return map;
  };

  const handleRuleTypeSwitch = (newType) => {
    if (newType === rule.ruleType) return;
    if (newType === "weekdays") {
      updateRoutineRule(rule.id, {
        ...rule,
        ruleType: "weekdays",
        weekdayMap: getCurrentWeekdayMap()
      });
    } else {
      updateRoutineRule(rule.id, {
        ...rule,
        ruleType: "loop",
        anchorDate: rule.anchorDate || "2026-10-19",
        loopSequence: cycleKeys
      });
    }
  };

  const handleToggleWeekday = (dayNum) => {
    const currentMap = { ...getCurrentWeekdayMap() };
    const fallbackCycle = cycleKeys.find((k) => k !== activeCycleId) || activeCycleId;

    if (currentMap[dayNum] === activeCycleId) {
      currentMap[dayNum] = fallbackCycle;
    } else {
      currentMap[dayNum] = activeCycleId;
    }

    updateRoutineRule(rule.id, {
      ...rule,
      weekdayMap: currentMap
    });
  };

  const handleAddStepToCycle = (itemId) => {
    const currentSteps = activeCycle.stepItemIds || [];
    if (currentSteps.includes(itemId)) return;
    updateRoutineRule(rule.id, {
      ...rule,
      cycles: {
        ...rule.cycles,
        [activeCycleId]: {
          ...activeCycle,
          stepItemIds: [...currentSteps, itemId]
        }
      }
    });
  };

  const handleRemoveStepFromCycle = (itemId) => {
    const currentSteps = activeCycle.stepItemIds || [];
    updateRoutineRule(rule.id, {
      ...rule,
      cycles: {
        ...rule.cycles,
        [activeCycleId]: {
          ...activeCycle,
          stepItemIds: currentSteps.filter((id) => id !== itemId)
        }
      }
    });
  };

  const handleMoveStep = (index, direction) => {
    const steps = [...(activeCycle.stepItemIds || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const temp = steps[index];
    steps[index] = steps[targetIdx];
    steps[targetIdx] = temp;

    updateRoutineRule(rule.id, {
      ...rule,
      cycles: {
        ...rule.cycles,
        [activeCycleId]: {
          ...activeCycle,
          stepItemIds: steps
        }
      }
    });
  };

  const handleSaveCycleModal = () => {
    if (!cycleLabelInput.trim()) return;

    if (cycleModalMode === "rename") {
      updateRoutineRule(rule.id, {
        ...rule,
        cycles: {
          ...rule.cycles,
          [activeCycleId]: {
            ...activeCycle,
            label: cycleLabelInput.trim()
          }
        }
      });
    } else {
      let nextNum = cycleKeys.length + 1;
      while (rule.cycles[`cycle_${nextNum}`]) {
        nextNum += 1;
      }
      const newKey = `cycle_${nextNum}`;

      const updatedCycles = {
        ...rule.cycles,
        [newKey]: {
          label: cycleLabelInput.trim(),
          theme: "plum",
          stepItemIds: []
        }
      };
      updateRoutineRule(rule.id, {
        ...rule,
        loopSequence: [...(rule.loopSequence || cycleKeys), newKey],
        cycles: updatedCycles
      });
      setSelectedCycleKey(newKey);
    }

    setCycleLabelInput("");
    setIsCycleModalOpen(false);
  };

  const handleDeleteActiveCycle = () => {
    if (cycleKeys.length <= 1) return;
    const updatedCycles = { ...rule.cycles };
    delete updatedCycles[activeCycleId];
    const remainingKeys = Object.keys(updatedCycles);

    const updatedMap = { ...getCurrentWeekdayMap() };
    Object.keys(updatedMap).forEach((d) => {
      if (updatedMap[d] === activeCycleId) {
        updatedMap[d] = remainingKeys[0];
      }
    });

    updateRoutineRule(rule.id, {
      ...rule,
      loopSequence: (rule.loopSequence || []).filter((k) => k !== activeCycleId),
      activeCycleId: remainingKeys[0],
      defaultCycleId: remainingKeys[1] || remainingKeys[0],
      weekdayMap: updatedMap,
      cycles: updatedCycles
    });
    setSelectedCycleKey(remainingKeys[0]);
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-2.5 overflow-hidden select-none">
      {/* 1. CATEGORY SELECTOR PILLS */}
      <div className="grid grid-cols-6 gap-1 bg-cream-200/70 p-1 rounded-2xl shrink-0">
        {RULE_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedRuleId(t.id);
              setSelectedCycleKey(null);
              setIsDeletingShelf(false);
            }}
            className={`py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center transition ${
              selectedRuleId === t.id
                ? "bg-espresso-900 text-cream-50 shadow-xs"
                : "text-espresso-700 hover:bg-white/60"
            }`}
          >
            <span>{t.emoji}</span>
            <span className="truncate max-w-full px-0.5">{t.label}</span>
          </button>
        ))}
      </div>

      {/* 2. GRAPHIC RULE LOGIC CARD */}
      <div className="my-2 p-3 rounded-3xl bento-ritual-gradient text-cream-50 shadow-bento relative overflow-hidden shrink-0">
        <Sparkles className="w-16 h-16 text-white/5 absolute -right-3 -bottom-3 pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">
              Schedule Logic • {rule.timeWindow}
            </span>
            <h3 className="text-sm font-bold leading-tight">{rule.title} Rotation</h3>
          </div>

          <div className="flex bg-black/25 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => handleRuleTypeSwitch("loop")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                rule.ruleType === "loop"
                  ? "bg-terracotta-500 text-white"
                  : "text-cream-200/70"
              }`}
            >
              <RefreshCw className="w-3 h-3" /> Loop
            </button>
            <button
              onClick={() => handleRuleTypeSwitch("weekdays")}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                rule.ruleType === "weekdays"
                  ? "bg-terracotta-500 text-white"
                  : "text-cream-200/70"
              }`}
            >
              <CalendarDays className="w-3 h-3" /> Days
            </button>
          </div>
        </div>

        {rule.ruleType === "loop" ? (
          <div className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2.5 py-1.5 rounded-xl">
            <span className="text-cream-200/80 font-medium">Alternates:</span>
            <span className="font-bold text-amber-500 truncate">
              {cycleKeys.map((k) => rule.cycles[k]?.label.split(":")[0]).join(" ➔ ")} ➔ Repeat
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1 bg-white/10 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] text-cream-200/90 font-semibold truncate">
              Days for <strong className="text-amber-500">{activeCycle.label.split(":")[0]}</strong>:
            </span>
            <div className="flex gap-1 shrink-0">
              {WEEKDAY_BUTTONS.map((w) => {
                const map = getCurrentWeekdayMap();
                const assignedCycleKey = map[w.dayNum];
                const isAssignedToCurrent = assignedCycleKey === activeCycleId;
                const assignedCycleIndex = cycleKeys.indexOf(assignedCycleKey) + 1;

                return (
                  <button
                    key={w.dayNum}
                    onClick={() => handleToggleWeekday(w.dayNum)}
                    className={`w-6 h-6 rounded-lg text-[10px] font-extrabold transition flex flex-col items-center justify-center leading-none ${
                      isAssignedToCurrent
                        ? "bg-amber-500 text-espresso-950 shadow-2xs scale-105"
                        : "bg-black/25 text-cream-200/60 hover:bg-black/40"
                    }`}
                    title={`Assigned to: ${rule.cycles[assignedCycleKey]?.label}`}
                  >
                    <span>{w.label}</span>
                    <span className="text-[7px] opacity-80">C{assignedCycleIndex}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. CYCLE RECIPE & SHELF EDITOR */}
      <div className="flex-1 min-h-0 bg-white/85 border border-espresso-900/10 rounded-3xl p-3.5 shadow-bento flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between gap-1 mb-2 shrink-0">
          <div className="flex gap-1 overflow-x-auto no-scrollbar items-center">
            {cycleKeys.map((cKey) => {
              const cObj = rule.cycles[cKey];
              const isSelected = cKey === activeCycleId;
              return (
                <button
                  key={cKey}
                  onClick={() => setSelectedCycleKey(cKey)}
                  className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition whitespace-nowrap ${
                    isSelected
                      ? "bg-terracotta-500 text-white shadow-2xs"
                      : "bg-cream-200/80 text-espresso-800 hover:bg-cream-200"
                  }`}
                >
                  {cObj.label} ({cObj.stepItemIds.length})
                </button>
              );
            })}

            <button
              onClick={() => {
                setCycleModalMode("create");
                setCycleLabelInput("");
                setIsCycleModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-cream-200 text-espresso-800 hover:bg-espresso-900 hover:text-white text-[10px] font-bold whitespace-nowrap transition"
              title="Add another cycle (e.g. Cycle C)"
            >
              + Cycle
            </button>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                setCycleModalMode("rename");
                setCycleLabelInput(activeCycle.label);
                setIsCycleModalOpen(true);
              }}
              className="p-1.5 rounded-xl bg-cream-200/80 text-espresso-800 hover:bg-espresso-900 hover:text-white transition"
              title="Rename this cycle"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {cycleKeys.length > 1 && (
              <button
                onClick={handleDeleteActiveCycle}
                className="p-1.5 rounded-xl bg-terracotta-100 text-terracotta-600 hover:bg-terracotta-500 hover:text-white transition"
                title="Delete this cycle"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Ordered Steps inside Active Cycle */}
        <div className="flex-1 min-h-0 space-y-2 overflow-y-auto no-scrollbar py-1">
          {activeCycle.stepItemIds.length === 0 ? (
            <p className="text-xs text-center text-espresso-700/60 py-8">
              No steps in this cycle yet. Tap any chip from your shelf below to add!
            </p>
          ) : (
            activeCycle.stepItemIds.map((itemId, idx) => {
              const item = state.shelfItems[itemId] || { name: itemId };
              return (
                <div
                  key={itemId}
                  className="px-3 py-2 rounded-2xl bg-cream-50 border border-espresso-900/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-espresso-900 text-cream-50 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-espresso-900 truncate">
                      {item.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => handleMoveStep(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded-lg text-espresso-700/60 hover:bg-cream-200 disabled:opacity-25"
                      title="Move step up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveStep(idx, 1)}
                      disabled={idx === activeCycle.stepItemIds.length - 1}
                      className="p-1 rounded-lg text-espresso-700/60 hover:bg-cream-200 disabled:opacity-25"
                      title="Move step down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleRemoveStepFromCycle(itemId)}
                      className="p-1 rounded-lg text-terracotta-500 hover:bg-terracotta-100/60 transition"
                      title="Remove from cycle"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Shelf Strip */}
        <div className="pt-2.5 border-t border-espresso-900/10 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-espresso-700/70">
              {isDeletingShelf
                ? "Tap a shelf chip to DELETE it:"
                : `Your ${activeTabMeta.label} Shelf (Tap to add ↑)`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDeletingShelf(!isDeletingShelf)}
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg transition ${
                  isDeletingShelf
                    ? "bg-terracotta-500 text-white"
                    : "text-espresso-700/70 hover:text-terracotta-600"
                }`}
              >
                {isDeletingShelf ? "Done" : "🗑️ Edit Shelf"}
              </button>
              <button
                onClick={() => setIsShelfModalOpen(true)}
                className="text-[10px] font-extrabold text-terracotta-600 hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" /> New Item
              </button>
            </div>
          </div>

          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categoryShelfItems.map((item) => {
              const alreadyInCycle = activeCycle.stepItemIds.includes(item.id);

              if (isDeletingShelf) {
                return (
                  <button
                    key={item.id}
                    onClick={() => deleteShelfItem(item.id)}
                    className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap flex items-center gap-1 bg-terracotta-100 text-terracotta-600 border border-terracotta-500/30 hover:bg-terracotta-500 hover:text-white transition"
                    title="Delete from shelf permanently"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{item.name}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleAddStepToCycle(item.id)}
                  disabled={alreadyInCycle}
                  className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold whitespace-nowrap flex items-center gap-1 transition ${
                    alreadyInCycle
                      ? "bg-olive-100 text-olive-600 opacity-60 cursor-default"
                      : "bg-cream-200/90 text-espresso-900 hover:bg-terracotta-500 hover:text-white"
                  }`}
                >
                  {alreadyInCycle ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SLIDE-UP SHEET 1: ADD NEW PRODUCT TO SHELF */}
      <BottomSheet
        isOpen={isShelfModalOpen}
        onClose={() => setIsShelfModalOpen(false)}
        badge={`${activeTabMeta.label} Shelf`}
        title="Add New Product or Exercise Chip"
        subtitle="Once added to your shelf, you can tap it into any cycle."
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newChipName}
            onChange={(e) => setNewChipName(e.target.value)}
            placeholder="e.g. Kojic Acid Serum or Ceramide Cream..."
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-medium"
          />
          <button
            onClick={() => {
              if (!newChipName.trim()) return;
              const newId = addShelfItem(activeTabMeta.category, newChipName.trim());
              handleAddStepToCycle(newId);
              setNewChipName("");
              setIsShelfModalOpen(false);
            }}
            className="px-4 py-2 rounded-xl bg-terracotta-500 text-white text-xs font-bold"
          >
            Save Chip
          </button>
        </div>
      </BottomSheet>

      {/* SLIDE-UP SHEET 2: RENAME CYCLE OR CREATE NEW CYCLE */}
      <BottomSheet
        isOpen={isCycleModalOpen}
        onClose={() => setIsCycleModalOpen(false)}
        badge={rule.title}
        title={cycleModalMode === "rename" ? "Rename Cycle" : "Create New Cycle"}
        subtitle={
          cycleModalMode === "rename"
            ? "Give this cycle a clear name that shows up on your Today card."
            : "This new cycle will be added to your rotation."
        }
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={cycleLabelInput}
            onChange={(e) => setCycleLabelInput(e.target.value)}
            placeholder="e.g. Cycle C: Reset & Mask..."
            className="flex-1 px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
          />
          <button
            onClick={handleSaveCycleModal}
            className="px-4 py-2 rounded-xl bg-espresso-900 text-cream-50 text-xs font-bold"
          >
            {cycleModalMode === "rename" ? "Save Name" : "Create Cycle"}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}