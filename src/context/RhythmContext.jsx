import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_RHYTHM_STATE } from "../utils/initialData";
import { formatDateKey } from "../utils/cycleEngine";

const STORAGE_KEY = "rhythm_app_state_v2";
const RhythmContext = createContext(null);

export function RhythmProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_RHYTHM_STATE;
    } catch {
      return INITIAL_RHYTHM_STATE;
    }
  });

  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));
  const [activeTimeWindow, setActiveTimeWindow] = useState(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Morning";
    if (hr < 18) return "Afternoon";
    return "Night";
  });

  // Auto-save to localStorage on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state:", e);
    }
  }, [state]);

  // Apply the selected color theme to <html> whenever it changes
  const activeTheme = state.theme || "terracotta";
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  // Switch Color Theme
  const setAppTheme = (themeId) => {
    setState((prev) => ({
      ...prev,
      theme: themeId
    }));
  };

  // 1. RITUALS & LOW STOCK
  const toggleRitualStep = (stepLogKey) => {
    setState((prev) => {
      const dayLog = prev.dailyLogs[selectedDate] || { completedSteps: [], medStatus: {} };
      const exists = dayLog.completedSteps.includes(stepLogKey);
      const updatedSteps = exists
        ? dayLog.completedSteps.filter((k) => k !== stepLogKey)
        : [...dayLog.completedSteps, stepLogKey];

      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [selectedDate]: { ...dayLog, completedSteps: updatedSteps }
        }
      };
    });
  };

  const toggleLowStock = (itemId) => {
    setState((prev) => ({
      ...prev,
      shelfItems: {
        ...prev.shelfItems,
        [itemId]: {
          ...prev.shelfItems[itemId],
          isLowStock: !prev.shelfItems[itemId].isLowStock
        }
      }
    }));
  };

  const updateRoutineRule = (ruleId, updatedRuleObj) => {
    setState((prev) => ({
      ...prev,
      routineRules: {
        ...prev.routineRules,
        [ruleId]: updatedRuleObj
      }
    }));
  };

  const addShelfItem = (category, name) => {
    const id = `item_${Date.now()}`;
    setState((prev) => ({
      ...prev,
      shelfItems: {
        ...prev.shelfItems,
        [id]: { id, category, name, icon: "Sparkles", isLowStock: false }
      }
    }));
    return id;
  };

  // 2. MEDICATIONS (Log, Add, Delete)
  const updateMedStatus = (medId, statusStr) => {
    setState((prev) => {
      const dayLog = prev.dailyLogs[selectedDate] || { completedSteps: [], medStatus: {} };
      return {
        ...prev,
        dailyLogs: {
          ...prev.dailyLogs,
          [selectedDate]: {
            ...dayLog,
            medStatus: { ...dayLog.medStatus, [medId]: statusStr }
          }
        }
      };
    });
  };

  const addMedication = ({ name, time, timeWindow, mealTag }) => {
    setState((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          id: `med_${Date.now()}`,
          name: name.trim(),
          time: time.trim() || "09:00 AM",
          timeWindow: timeWindow || "Morning",
          mealTag: mealTag || "After Meal"
        }
      ]
    }));
  };

  const deleteMedication = (medId) => {
    setState((prev) => ({
      ...prev,
      medications: prev.medications.filter((m) => m.id !== medId)
    }));
  };

  // 3. BIRTHDAYS (Add, Delete)
  const addBirthday = ({ name, month, day }) => {
    setState((prev) => ({
      ...prev,
      birthdays: [
        ...prev.birthdays,
        {
          id: `bday_${Date.now()}`,
          name: name.trim(),
          month: Number(month),
          day: Number(day),
          note: "Send a warm wish!"
        }
      ]
    }));
  };

  const deleteBirthday = (bdayId) => {
    setState((prev) => ({
      ...prev,
      birthdays: prev.birthdays.filter((b) => b.id !== bdayId)
    }));
  };

  // 4. EVENING WIND-DOWN SLOT
  const updateWindDownSlot = (title, tag = "Evening Ritual") => {
    setState((prev) => ({
      ...prev,
      windDownSlot: { title, tag }
    }));
  };

  // 5. HOME RESET TRACKERS
  const completeHomeReset = (trackerId) => {
    setState((prev) => ({
      ...prev,
      intervalTrackers: prev.intervalTrackers.map((t) =>
        t.id === trackerId ? { ...t, lastCompletedDate: selectedDate } : t
      )
    }));
  };

  const updateHomeResetInterval = (trackerId, newIntervalDays) => {
    setState((prev) => ({
      ...prev,
      intervalTrackers: prev.intervalTrackers.map((t) =>
        t.id === trackerId ? { ...t, intervalDays: Math.max(1, newIntervalDays) } : t
      )
    }));
  };

  const addHomeResetTracker = (title, intervalDays = 7) => {
    setState((prev) => ({
      ...prev,
      intervalTrackers: [
        ...prev.intervalTrackers,
        {
          id: `reset_${Date.now()}`,
          title,
          timeWindow: "Afternoon",
          intervalDays: Number(intervalDays) || 7,
          lastCompletedDate: selectedDate
        }
      ]
    }));
  };

  // 6. MEALS & PANTRY

  const addDishToPantry = ({ name, emoji = "🍲", category = "main", prepTiming = "none", prepText = "" }) => {
    const id = `dish_${Date.now()}`;
    const prepRule =
      prepTiming !== "none" && prepText.trim()
        ? { timing: prepTiming, text: prepText.trim() }
        : null;

    setState((prev) => ({
      ...prev,
      dishPantry: {
        ...prev.dishPantry,
        [id]: { id, name, emoji, category, prepRule }
      }
    }));
    return id;
  };

  // 7. MIND UNLOAD TASKS
  const addMindUnloadTask = (text, timeWindow = "Afternoon") => {
    setState((prev) => ({
      ...prev,
      mindUnload: [
        ...prev.mindUnload,
        { id: `task_${Date.now()}`, text, timeWindow, done: false }
      ]
    }));
  };

  const toggleMindUnloadTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      mindUnload: prev.mindUnload.map((t) =>
        t.id === taskId ? { ...t, done: !t.done } : t
      )
    }));
  };

  // 8. FULL BACKUP IMPORT / RESET
  const importFullState = (jsonObj) => {
    if (jsonObj && jsonObj.shelfItems && jsonObj.routineRules) {
      setState(jsonObj);
      return true;
    }
    return false;
  };

  // Delete a Shelf Item AND remove it from any Cycle Recipes that used it
  const deleteShelfItem = (itemId) => {
    setState((prev) => {
      const updatedShelf = { ...prev.shelfItems };
      delete updatedShelf[itemId];

      const updatedRules = { ...prev.routineRules };
      Object.keys(updatedRules).forEach((ruleKey) => {
        const rule = updatedRules[ruleKey];
        const updatedCycles = { ...rule.cycles };
        Object.keys(updatedCycles).forEach((cKey) => {
          updatedCycles[cKey] = {
            ...updatedCycles[cKey],
            stepItemIds: (updatedCycles[cKey].stepItemIds || []).filter((id) => id !== itemId)
          };
        });
        updatedRules[ruleKey] = { ...rule, cycles: updatedCycles };
      });

      return {
        ...prev,
        shelfItems: updatedShelf,
        routineRules: updatedRules
      };
    });
  };

// Toggle a Dish Chip in/out of a Day + Meal Slot array (Supports multiple items per meal!)
  const assignDishToSlot = (weekday, slotKey, dishId) => {
    setState((prev) => {
      const currentSlotVal = prev.weeklyMealPlan[weekday]?.[slotKey];
      const currentArr = Array.isArray(currentSlotVal)
        ? currentSlotVal.filter(Boolean)
        : currentSlotVal
        ? [currentSlotVal]
        : [];

      const exists = currentArr.includes(dishId);
      const updatedArr = exists
        ? currentArr.filter((id) => id !== dishId)
        : [...currentArr, dishId];

      return {
        ...prev,
        weeklyMealPlan: {
          ...prev.weeklyMealPlan,
          [weekday]: {
            ...prev.weeklyMealPlan[weekday],
            [slotKey]: updatedArr
          }
        }
      };
    });
  };

  // Delete a Dish from Pantry AND remove it from any Weekly Meal Plan arrays
  const deleteDishFromPantry = (dishId) => {
    setState((prev) => {
      const updatedPantry = { ...prev.dishPantry };
      delete updatedPantry[dishId];

      const updatedWeeklyPlan = { ...prev.weeklyMealPlan };
      Object.keys(updatedWeeklyPlan).forEach((dayKey) => {
        const dayPlan = { ...updatedWeeklyPlan[dayKey] };
        ["bfast", "lunch", "snack", "dinner"].forEach((slot) => {
          const val = dayPlan[slot];
          const arr = Array.isArray(val) ? val : val ? [val] : [];
          dayPlan[slot] = arr.filter((id) => id !== dishId);
        });
        updatedWeeklyPlan[dayKey] = dayPlan;
      });

      return {
        ...prev,
        dishPantry: updatedPantry,
        weeklyMealPlan: updatedWeeklyPlan
      };
    });
  };

  // Delete a Home Reset Tracker
  const deleteHomeResetTracker = (trackerId) => {
    setState((prev) => ({
      ...prev,
      intervalTrackers: prev.intervalTrackers.filter((t) => t.id !== trackerId)
    }));
  };

  // Delete a Mind Unload Task
  const deleteMindUnloadTask = (taskId) => {
    setState((prev) => ({
      ...prev,
      mindUnload: prev.mindUnload.filter((t) => t.id !== taskId)
    }));
  };

  return (
    <RhythmContext.Provider
      value={{
        state,
        selectedDate,
        setSelectedDate,
        activeTimeWindow,
        setActiveTimeWindow,
        toggleRitualStep,
        toggleLowStock,
        updateMedStatus,
        addMedication,
        deleteMedication,
        addBirthday,
        deleteBirthday,
        updateWindDownSlot,
        completeHomeReset,
        updateHomeResetInterval,
        addHomeResetTracker,
        assignDishToSlot,
        addDishToPantry,
        updateRoutineRule,
        addShelfItem,
        addMindUnloadTask,
        toggleMindUnloadTask,
        importFullState,
        activeTheme,
        setAppTheme,
        deleteShelfItem,
        deleteDishFromPantry,
        deleteHomeResetTracker,
        deleteMindUnloadTask
      }}
    >
      {children}
    </RhythmContext.Provider>
  );
}

export const useRhythm = () => useContext(RhythmContext);