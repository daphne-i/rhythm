const WEEKDAY_KEYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getWeekdayName(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  return WEEKDAY_KEYS[dateObj.getDay()];
}

export function addDays(dateStr, daysToAdd) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  dateObj.setDate(dateObj.getDate() + daysToAdd);
  return formatDateKey(dateObj);
}

export function diffInDays(startStr, endStr) {
  const [y1, m1, d1] = startStr.split("-").map(Number);
  const [y2, m2, d2] = endStr.split("-").map(Number);
  const dStart = new Date(y1, m1 - 1, d1);
  const dEnd = new Date(y2, m2 - 1, d2);
  return Math.round((dEnd - dStart) / (1000 * 60 * 60 * 24));
}

// 1. Resolve which Cycle (A, B, C, Wash, Rest) is active on targetDateStr
export function resolveRoutineForDate(rule, targetDateStr, shelfItems, completedStepsForDay = []) {
  let activeCycleKey = null;
  const cycleKeys = Object.keys(rule.cycles);

  if (rule.ruleType === "loop") {
    const seq = rule.loopSequence && rule.loopSequence.length > 0 ? rule.loopSequence : cycleKeys;
    const delta = diffInDays(rule.anchorDate || "2026-10-19", targetDateStr);
    const seqLen = seq.length;
    const index = ((delta % seqLen) + seqLen) % seqLen;
    activeCycleKey = seq[index];
  } else if (rule.ruleType === "weekdays") {
    const [y, m, d] = targetDateStr.split("-").map(Number);
    const dayNum = new Date(y, m - 1, d).getDay(); // 0 (Sun) to 6 (Sat)

    // Multi-cycle weekday map: { 0: "cycle_c", 1: "cycle_a", 2: "cycle_b", ... }
    if (rule.weekdayMap && rule.weekdayMap[dayNum] && rule.cycles[rule.weekdayMap[dayNum]]) {
      activeCycleKey = rule.weekdayMap[dayNum];
    } else if (rule.activeWeekdays) {
      // Fallback for initial 2-cycle setup
      activeCycleKey = rule.activeWeekdays.includes(dayNum)
        ? rule.activeCycleId || cycleKeys[0]
        : rule.defaultCycleId || cycleKeys[1] || cycleKeys[0];
    } else {
      activeCycleKey = cycleKeys[0];
    }
  }

  const cycle = rule.cycles[activeCycleKey] || Object.values(rule.cycles)[0];
  const steps = (cycle.stepItemIds || []).map((itemId) => {
    const item = shelfItems[itemId] || { id: itemId, name: itemId, isLowStock: false };
    const stepLogKey = `${rule.id}:${itemId}`;
    return {
      ...item,
      stepLogKey,
      done: completedStepsForDay.includes(stepLogKey)
    };
  });

  const doneCount = steps.filter((s) => s.done).length;

  return {
    ruleId: rule.id,
    title: rule.title,
    category: rule.category,
    timeWindow: rule.timeWindow,
    cycleKey: activeCycleKey,
    cycleLabel: cycle.label,
    theme: cycle.theme || "terracotta",
    isHighlight: Boolean(cycle.isHighlight),
    steps,
    doneCount,
    totalCount: steps.length
  };
}

// 2. Resolve Today's Meals + Automatic Cross-Day Prep Alerts
export function resolveMealsAndPrepForDate(state, targetDateStr) {
  const todayWeekday = getWeekdayName(targetDateStr);
  const tomorrowDateStr = addDays(targetDateStr, 1);
  const tomorrowWeekday = getWeekdayName(tomorrowDateStr);

  const todayPlanIds = state.weeklyMealPlan[todayWeekday] || {};
  const tomorrowPlanIds = state.weeklyMealPlan[tomorrowWeekday] || {};

  const getDish = (id) =>
    state.dishPantry[id] || { id, name: "Unplanned", emoji: "🍽️", prepRule: null };

  const todayMeals = {
    bfast: getDish(todayPlanIds.bfast),
    lunch: getDish(todayPlanIds.lunch),
    snack: getDish(todayPlanIds.snack),
    dinner: getDish(todayPlanIds.dinner)
  };

  const tomorrowMeals = {
    bfast: getDish(tomorrowPlanIds.bfast),
    lunch: getDish(tomorrowPlanIds.lunch),
    snack: getDish(tomorrowPlanIds.snack),
    dinner: getDish(tomorrowPlanIds.dinner)
  };

  // Morning Prep Alerts (for Today's meals that need "morning_of" prep)
  const morningPrepAlerts = [];
  Object.entries(todayMeals).forEach(([slot, dish]) => {
    if (dish.prepRule && dish.prepRule.timing === "morning_of") {
      morningPrepAlerts.push({
        id: `prep_morn_${slot}_${dish.id}`,
        text: dish.prepRule.text,
        forDish: dish.name,
        timeWindow: "Morning"
      });
    }
  });

  // Night-Before Prep Alerts (inspects TOMORROW'S meals for "night_before" prep)
  const nightPrepAlerts = [];
  Object.entries(tomorrowMeals).forEach(([slot, dish]) => {
    if (dish.prepRule && dish.prepRule.timing === "night_before") {
      nightPrepAlerts.push({
        id: `prep_night_${slot}_${dish.id}`,
        text: dish.prepRule.text,
        forDish: `Tomorrow's ${dish.name}`,
        timeWindow: "Night"
      });
    }
  });

  return {
    todayWeekday,
    tomorrowWeekday,
    todayMeals,
    morningPrepAlerts,
    nightPrepAlerts
  };
}

// 3. Resolve Due Home Reset Trackers
export function resolveDueHomeResets(intervalTrackers, targetDateStr) {
  return intervalTrackers
    .map((tracker) => {
      const daysElapsed = diffInDays(tracker.lastCompletedDate, targetDateStr);
      const daysRemaining = tracker.intervalDays - daysElapsed;
      return {
        ...tracker,
        daysElapsed,
        daysRemaining,
        isDue: daysRemaining <= 0
      };
    })
    .filter((t) => t.isDue);
}