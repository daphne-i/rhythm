export const INITIAL_RHYTHM_STATE = {
  version: 1,

  // 1. PRODUCT & STEP SHELF (Tappable Chips)
  shelfItems: {
    // Face
    item_cleanser: { id: "item_cleanser", category: "face", name: "Gentle Cleanser", icon: "Droplets", isLowStock: false },
    item_niacinamide: { id: "item_niacinamide", category: "face", name: "10% Niacinamide Serum", icon: "Sparkles", isLowStock: false },
    item_acid: { id: "item_acid", category: "face", name: "Exfoliating Acid Serum", icon: "Zap", isLowStock: false },
    item_peptide: { id: "item_peptide", category: "face", name: "Soothing Peptide Serum", icon: "Heart", isLowStock: false },
    item_cerave: { id: "item_cerave", category: "face", name: "CeraVe Moisturizing Lotion", icon: "Shield", isLowStock: true },
    item_spf: { id: "item_spf", category: "face", name: "Broad Spectrum SPF 50", icon: "Sun", isLowStock: false },

    // Hair
    item_pre_oil: { id: "item_pre_oil", category: "hair", name: "Pre-Wash Hair Oil (30m)", icon: "Droplet", isLowStock: false },
    item_shampoo: { id: "item_shampoo", category: "hair", name: "Clarifying Shampoo", icon: "Sparkles", isLowStock: false },
    item_hair_mask: { id: "item_hair_mask", category: "hair", name: "Deep Conditioning Mask", icon: "Crown", isLowStock: false },
    item_leave_in: { id: "item_leave_in", category: "hair", name: "Leave-in Cream", icon: "Feather", isLowStock: false },
    item_braid: { id: "item_braid", category: "hair", name: "Scalp Serum & Loose Braid", icon: "Moon", isLowStock: false },

    // Body
    item_body_wash: { id: "item_body_wash", category: "body", name: "Gentle Body Wash", icon: "Bath", isLowStock: false },
    item_aha_wash: { id: "item_aha_wash", category: "body", name: "AHA Exfoliating Body Wash", icon: "Sparkles", isLowStock: false },
    item_body_lotion: { id: "item_body_lotion", category: "body", name: "Barrier Moisturizing Lotion", icon: "Heart", isLowStock: false },
    item_dusting_powder: { id: "item_dusting_powder", category: "body", name: "Silken Dusting Powder", icon: "Wind", isLowStock: false },

    // Move
    item_upper_body: { id: "item_upper_body", category: "move", name: "Upper Body & Core (30m)", icon: "Dumbbell", isLowStock: false },
    item_lower_body: { id: "item_lower_body", category: "move", name: "Lower Body Strength (30m)", icon: "Flame", isLowStock: false },
    item_walk: { id: "item_walk", category: "move", name: "Brisk Walk (8k Steps)", icon: "Footprints", isLowStock: false },
    item_stretch: { id: "item_stretch", category: "move", name: "10m Evening Mobility Stretch", icon: "Activity", isLowStock: false }
  },

  // 2. ROUTINE RULES (Loop, Weekdays, Daily)
  routineRules: {
    face_am: {
      id: "face_am",
      title: "Face AM",
      category: "face",
      timeWindow: "Morning",
      ruleType: "loop",
      anchorDate: "2026-10-19",
      loopSequence: ["daily_am"],
      cycles: {
        daily_am: {
          label: "Daily Brightening & SPF",
          theme: "terracotta",
          stepItemIds: ["item_cleanser", "item_niacinamide", "item_cerave", "item_spf"]
        }
      }
    },
    face_pm: {
      id: "face_pm",
      title: "Face PM",
      category: "face",
      timeWindow: "Night",
      ruleType: "loop",
      anchorDate: "2026-10-19",
      loopSequence: ["cycle_a", "cycle_b"],
      cycles: {
        cycle_a: {
          label: "Cycle A: Active Exfoliation",
          theme: "plum",
          stepItemIds: ["item_cleanser", "item_acid", "item_cerave"]
        },
        cycle_b: {
          label: "Cycle B: Barrier Repair",
          theme: "olive",
          stepItemIds: ["item_cleanser", "item_peptide", "item_cerave"]
        }
      }
    },
    hair_care: {
      id: "hair_care",
      title: "Hair Ritual",
      category: "hair",
      timeWindow: "Morning",
      ruleType: "weekdays",
      activeWeekdays: [3, 0], // Wednesday (3) & Sunday (0)
      activeCycleId: "wash_day",
      defaultCycleId: "rest_day",
      cycles: {
        wash_day: {
          label: "Wash & Mask Day",
          theme: "teal",
          isHighlight: true,
          stepItemIds: ["item_pre_oil", "item_shampoo", "item_hair_mask", "item_leave_in"]
        },
        rest_day: {
          label: "Rest & Protect",
          theme: "espresso",
          isHighlight: false,
          stepItemIds: ["item_braid"]
        }
      }
    },
    body_care: {
      id: "body_care",
      title: "Body Care",
      category: "body",
      timeWindow: "Morning",
      ruleType: "weekdays",
      activeWeekdays: [2, 5], // Tuesday (2) & Friday (5)
      activeCycleId: "exfoliate_body",
      defaultCycleId: "daily_body",
      cycles: {
        exfoliate_body: {
          label: "AHA Exfoliation Day",
          theme: "terracotta",
          stepItemIds: ["item_aha_wash", "item_body_lotion", "item_dusting_powder"]
        },
        daily_body: {
          label: "Daily Barrier Care",
          theme: "olive",
          stepItemIds: ["item_body_wash", "item_body_lotion", "item_dusting_powder"]
        }
      }
    },
    workout: {
      id: "workout",
      title: "Movement",
      category: "move",
      timeWindow: "Morning",
      ruleType: "loop",
      anchorDate: "2026-10-19",
      loopSequence: ["upper", "lower", "recovery"],
      cycles: {
        upper: { label: "Upper Body + Walk", theme: "terracotta", stepItemIds: ["item_upper_body", "item_walk"] },
        lower: { label: "Lower Body + Core", theme: "plum", stepItemIds: ["item_lower_body", "item_walk"] },
        recovery: { label: "Active Recovery", theme: "olive", stepItemIds: ["item_walk", "item_stretch"] }
      }
    }
  },

  // 3. HOME RESET INTERVAL TRACKERS
  intervalTrackers: [
    {
      id: "reset_pillowcases",
      title: "Change Pillowcases & Towels",
      timeWindow: "Afternoon",
      intervalDays: 4,
      lastCompletedDate: "2026-10-19"
    },
    {
      id: "reset_ac_filter",
      title: "Clean AC Filters",
      timeWindow: "Afternoon",
      intervalDays: 14,
      lastCompletedDate: "2026-10-12"
    },
    {
      id: "reset_drum_clean",
      title: "Washing Machine Drum Clean",
      timeWindow: "Afternoon",
      intervalDays: 30,
      lastCompletedDate: "2026-09-23"
    }
  ],

  // 4. SAVED DISH PANTRY (With Linked Prep Rules)
  dishPantry: {
    dish_moong_chilla: {
      id: "dish_moong_chilla",
      name: "Moong Dal Chilla",
      emoji: "🥞",
      category: "bfast",
      prepRule: { timing: "night_before", text: "Soak Moong Dal (for Chilla)" }
    },
    dish_ragi_idli: {
      id: "dish_ragi_idli",
      name: "Ragi Idli & Chutney",
      emoji: "🫓",
      category: "bfast",
      prepRule: { timing: "night_before", text: "Prep Ragi Idli batter" }
    },
    dish_besan_chilla: {
      id: "dish_besan_chilla",
      name: "Spiced Besan Chilla",
      emoji: "🌮",
      category: "bfast",
      prepRule: null
    },
    dish_millet_upma: {
      id: "dish_millet_upma",
      name: "Foxtail Millet Upma",
      emoji: "🥣",
      category: "bfast",
      prepRule: { timing: "morning_of", text: "Soak Foxtail Millet (30 mins)" }
    },
    dish_lemon_chicken: {
      id: "dish_lemon_chicken",
      name: "Garlic Lemon Chicken",
      emoji: "🍗",
      category: "main",
      prepRule: { timing: "night_before", text: "Thaw Chicken Breast & prep lemon-garlic marinade" }
    },
    dish_peri_chicken: {
      id: "dish_peri_chicken",
      name: "Peri-Peri Grilled Chicken",
      emoji: "🌶️",
      category: "main",
      prepRule: { timing: "night_before", text: "Thaw Chicken & rub Peri-Peri marinade" }
    },
    dish_shrimp_pasta: {
      id: "dish_shrimp_pasta",
      name: "Aglio Olio Shrimp Pasta",
      emoji: "🍤",
      category: "main",
      prepRule: { timing: "morning_of", text: "Thaw Peeled Prawns in fridge" }
    },
    dish_dal_stirfry: {
      id: "dish_dal_stirfry",
      name: "Comfort Dal, Rice & Stir-Fry",
      emoji: "🍛",
      category: "main",
      prepRule: null
    },
    dish_makhana: {
      id: "dish_makhana",
      name: "Ghee Roasted Makhana",
      emoji: "🍿",
      category: "snack",
      prepRule: null
    },
    dish_coffee_nuts: {
      id: "dish_coffee_nuts",
      name: "Filter Coffee & Almonds",
      emoji: "☕",
      category: "snack",
      prepRule: null
    }
  },

  // 5. WEEKLY MEAL MATRIX
  weeklyMealPlan: {
    Mon: { bfast: "dish_moong_chilla", lunch: "dish_lemon_chicken", snack: "dish_makhana", dinner: "dish_millet_upma" },
    Tue: { bfast: "dish_ragi_idli", lunch: "dish_peri_chicken", snack: "dish_coffee_nuts", dinner: "dish_shrimp_pasta" },
    Wed: { bfast: "dish_besan_chilla", lunch: "dish_dal_stirfry", snack: "dish_makhana", dinner: "dish_lemon_chicken" },
    Thu: { bfast: "dish_millet_upma", lunch: "dish_shrimp_pasta", snack: "dish_coffee_nuts", dinner: "dish_moong_chilla" },
    Fri: { bfast: "dish_moong_chilla", lunch: "dish_lemon_chicken", snack: "dish_makhana", dinner: "dish_shrimp_pasta" },
    Sat: { bfast: "dish_ragi_idli", lunch: "dish_peri_chicken", snack: "dish_coffee_nuts", dinner: "dish_dal_stirfry" },
    Sun: { bfast: "dish_besan_chilla", lunch: "dish_lemon_chicken", snack: "dish_makhana", dinner: "dish_millet_upma" }
  },

  // 6. MEAL-LINKED TABLETS
  medications: [
    { id: "med_morning", name: "Morning Supplement", time: "08:30 AM", timeWindow: "Morning", mealTag: "Before Breakfast" },
    { id: "med_vit_d", name: "Vitamin D3 / B12", time: "01:30 PM", timeWindow: "Afternoon", mealTag: "With Lunch" },
    { id: "med_night", name: "Magnesium / Night Tablet", time: "09:30 PM", timeWindow: "Night", mealTag: "After Dinner" }
  ],

  // 7. BIRTHDAYS & WIND-DOWN
  birthdays: [
    { id: "bday_1", name: "Aditi", month: 10, day: 23, note: "Send a warm wish!" }
  ],

  windDownSlot: {
    title: "Crochet Pullover (4 rows) or Read 20 pages",
    tag: "Evening Ritual"
  },

  // 8. MIND UNLOAD INBOX & DAILY COMPLETION LOGS
  mindUnload: [
    { id: "task_1", text: "Check grocery & pantry stock", timeWindow: "Afternoon", done: false },
    { id: "task_2", text: "Order new yarn skeins", timeWindow: "Night", done: false }
  ],

  dailyLogs: {}
};