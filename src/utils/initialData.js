export const INITIAL_RHYTHM_STATE = {
  version: 2,
  theme: "terracotta",

  // 1. EMPTY PRODUCT & EXERCISE SHELF
  shelfItems: {},

  // 2. EMPTY ROUTINE RULES (Ready for you to add your own steps & cycles)
  routineRules: {
    face_am: {
      id: "face_am",
      title: "Face AM",
      category: "face",
      timeWindow: "Morning",
      ruleType: "loop",
      anchorDate: "2026-10-24",
      loopSequence: ["cycle_1"],
      cycles: {
        cycle_1: {
          label: "Morning Routine",
          theme: "terracotta",
          stepItemIds: []
        }
      }
    },
    face_pm: {
      id: "face_pm",
      title: "Face PM",
      category: "face",
      timeWindow: "Night",
      ruleType: "loop",
      anchorDate: "2026-10-24",
      loopSequence: ["cycle_a", "cycle_b"],
      cycles: {
        cycle_a: {
          label: "Cycle A",
          theme: "plum",
          stepItemIds: []
        },
        cycle_b: {
          label: "Cycle B",
          theme: "olive",
          stepItemIds: []
        }
      }
    },
    hair_care: {
      id: "hair_care",
      title: "Hair Ritual",
      category: "hair",
      timeWindow: "Morning",
      ruleType: "weekdays",
      activeWeekdays: [3, 0],
      activeCycleId: "wash_day",
      defaultCycleId: "rest_day",
      cycles: {
        wash_day: {
          label: "Wash Day",
          theme: "teal",
          isHighlight: true,
          stepItemIds: []
        },
        rest_day: {
          label: "Non-Wash Day",
          theme: "espresso",
          isHighlight: false,
          stepItemIds: []
        }
      }
    },
    body_care: {
      id: "body_care",
      title: "Body Care",
      category: "body",
      timeWindow: "Morning",
      ruleType: "loop",
      anchorDate: "2026-10-24",
      loopSequence: ["daily_body"],
      cycles: {
        daily_body: {
          label: "Daily Body Care",
          theme: "olive",
          stepItemIds: []
        }
      }
    },
    workout: {
      id: "workout",
      title: "Movement",
      category: "move",
      timeWindow: "Morning",
      ruleType: "loop",
      anchorDate: "2026-10-24",
      loopSequence: ["move_1"],
      cycles: {
        move_1: {
          label: "Daily Movement",
          theme: "terracotta",
          stepItemIds: []
        }
      }
    }
  },

  // 3. EMPTY HOME RESET TRACKERS
  intervalTrackers: [],

  // 4. EMPTY SAVED DISH PANTRY
  dishPantry: {},

  // 5. EMPTY WEEKLY MEAL PLAN
  // 5. EMPTY WEEKLY MEAL PLAN (Arrays support multiple dishes per meal!)
  weeklyMealPlan: {
    Mon: { bfast: [], lunch: [], snack: [], dinner: [] },
    Tue: { bfast: [], lunch: [], snack: [], dinner: [] },
    Wed: { bfast: [], lunch: [], snack: [], dinner: [] },
    Thu: { bfast: [], lunch: [], snack: [], dinner: [] },
    Fri: { bfast: [], lunch: [], snack: [], dinner: [] },
    Sat: { bfast: [], lunch: [], snack: [], dinner: [] },
    Sun: { bfast: [], lunch: [], snack: [], dinner: [] }
  },

  // 6. EMPTY MEDICATIONS
  medications: [],

  // 7. EMPTY BIRTHDAYS & CLEAN WIND-DOWN SLOT
  birthdays: [],

  windDownSlot: {
    title: "",
    tag: "Evening Ritual"
  },

  // 8. EMPTY MIND UNLOAD & LOGS
  mindUnload: [],
  dailyLogs: {}
};