import React, { useState } from "react";
import {
  Zap,
  LayoutGrid,
  Plus,
  Trash2
} from "lucide-react";
import { useRhythm } from "../../context/RhythmContext";
import BottomSheet from "../layout/BottomSheet";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = [
  { key: "bfast", label: "🌅 Breakfast" },
  { key: "lunch", label: "☀️ Lunch" },
  { key: "snack", label: "☕ Snack" },
  { key: "dinner", label: "🌙 Dinner" }
];

export default function MealPlanner() {
  const { state, assignDishToSlot, addDishToPantry, deleteDishFromPantry } = useRhythm();

  const [selectedDay, setSelectedDay] = useState("Mon");
  const [activeSlot, setActiveSlot] = useState("bfast");
  const [pantryFilter, setPantryFilter] = useState("all");
  const [isGridView, setIsGridView] = useState(false);
  const [isNewDishOpen, setIsNewDishOpen] = useState(false);
  const [isDeletingDishes, setIsDeletingDishes] = useState(false);

  // New Dish Modal State
  const [dishName, setDishName] = useState("");
  const [dishEmoji, setDishEmoji] = useState("🍲");
  const [dishCategory, setDishCategory] = useState("main");
  const [prepTiming, setPrepTiming] = useState("night_before");
  const [prepText, setPrepText] = useState("");

  const dayPlan = state.weeklyMealPlan[selectedDay] || {};

  const getDish = (id) =>
    state.dishPantry[id] || { id, name: "Tap chip below", emoji: "🍽️", prepRule: null };

  // Assign Dish + Auto-Advance cursor to next meal slot
  const handleSelectDishChip = (dishId) => {
    assignDishToSlot(selectedDay, activeSlot, dishId);
    const slotOrder = ["bfast", "lunch", "snack", "dinner"];
    const nextIdx = (slotOrder.indexOf(activeSlot) + 1) % slotOrder.length;
    setActiveSlot(slotOrder[nextIdx]);
  };

  // Filter Saved Dish Chips
  const allDishes = Object.values(state.dishPantry);
  const filteredDishes = allDishes.filter((d) => {
    if (pantryFilter === "all") return true;
    if (pantryFilter === "prep") return Boolean(d.prepRule);
    return d.category === pantryFilter;
  });

  return (
    <div className="flex-1 flex flex-col justify-between px-4 py-2.5 overflow-hidden select-none">
      {/* 1. DAY PILLS + FULL WEEK MATRIX TOGGLE */}
      <div className="flex items-center justify-between gap-1.5 shrink-0">
        <div className="grid grid-cols-7 gap-1 flex-1 bg-cream-200/70 p-1 rounded-2xl">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDay(d);
                setIsGridView(false);
              }}
              className={`py-1.5 rounded-xl text-[10px] font-extrabold transition ${
                selectedDay === d && !isGridView
                  ? "bg-terracotta-500 text-white shadow-xs"
                  : "text-espresso-800 hover:bg-white/50"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsGridView(!isGridView)}
          className={`p-2 rounded-2xl border transition ${
            isGridView
              ? "bg-espresso-900 text-cream-50 border-espresso-900"
              : "bg-white text-espresso-800 border-espresso-900/10"
          }`}
          title="Toggle 7-Day Matrix View"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>

      {/* CONDITIONAL VIEW: 7-DAY FULL MATRIX vs DAY PLATE EDITOR */}
      {isGridView ? (
        <div className="flex-1 my-2.5 bg-white/90 border border-espresso-900/10 rounded-3xl p-3 shadow-bento overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-espresso-900">
              7-Day Weekly Meal Matrix
            </h3>
            <span className="text-[10px] text-terracotta-600 font-bold">
              Tap any cell to edit
            </span>
          </div>

          <div className="space-y-1.5">
            {DAYS.map((dayKey) => {
              const plan = state.weeklyMealPlan[dayKey] || {};
              return (
                <div
                  key={dayKey}
                  className="p-2 rounded-2xl bg-cream-50 border border-espresso-900/10 grid grid-cols-5 gap-1 items-center"
                >
                  <span className="text-xs font-extrabold text-terracotta-600">
                    {dayKey}
                  </span>
                  {["bfast", "lunch", "snack", "dinner"].map((sKey) => {
                    const dish = getDish(plan[sKey]);
                    return (
                      <button
                        key={sKey}
                        onClick={() => {
                          setSelectedDay(dayKey);
                          setActiveSlot(sKey);
                          setIsGridView(false);
                        }}
                        className="p-1.5 rounded-xl bg-white border border-espresso-900/5 text-left hover:border-terracotta-500 transition truncate"
                      >
                        <div className="text-[10px] font-bold text-espresso-900 truncate">
                          {dish.emoji} {dish.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          {/* 2. ACTIVE DAY'S 2x2 PLATE (4-Tap Auto-Advance Target) */}
          <div className="my-2.5 shrink-0">
            <div className="grid grid-cols-2 gap-2.5">
              {SLOTS.map((slot) => {
                const dish = getDish(dayPlan[slot.key]);
                const isSelected = activeSlot === slot.key;
                return (
                  <button
                    key={slot.key}
                    onClick={() => setActiveSlot(slot.key)}
                    className={`p-3.5 rounded-2xl text-left transition relative overflow-hidden border-2 ${
                      isSelected
                        ? "bg-white border-terracotta-500 shadow-bento scale-[1.01]"
                        : "bg-white/75 border-espresso-900/10 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-terracotta-600">
                        {slot.label}
                      </span>
                      {dish.prepRule && (
                        <span
                          className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-100 text-terracotta-600 font-bold flex items-center gap-0.5"
                          title={dish.prepRule.text}
                        >
                          <Zap className="w-2.5 h-2.5" /> Prep
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="text-base">{dish.emoji}</span>
                      <p className="text-xs font-bold text-espresso-900 truncate">
                        {dish.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. SAVED DISH CHIP PANTRY (Now expands into the full lower space) */}
          <div className="flex-1 min-h-0 bg-white/85 border border-espresso-900/10 rounded-3xl p-3.5 shadow-bento flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between gap-1 mb-2 shrink-0">
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: "all", label: "All" },
                  { id: "bfast", label: "🌅 Bfast" },
                  { id: "main", label: "🍗 Mains" },
                  { id: "snack", label: "☕ Snacks" },
                  { id: "prep", label: "⚡ Prep" }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setPantryFilter(f.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition ${
                      pantryFilter === f.id
                        ? "bg-espresso-900 text-cream-50"
                        : "bg-cream-200/70 text-espresso-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => setIsDeletingDishes(!isDeletingDishes)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition ${
                    isDeletingDishes
                      ? "bg-terracotta-500 text-white"
                      : "bg-cream-200/80 text-espresso-800 hover:bg-cream-200"
                  }`}
                  title="Toggle delete mode for saved dishes"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{isDeletingDishes ? "Done" : "Edit"}</span>
                </button>

                <button
                  onClick={() => setIsNewDishOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-terracotta-500 text-white text-[10px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Dish
                </button>
              </div>
            </div>

            {/* Tappable Dish Chips Grid */}
            <div className="flex flex-wrap gap-2 overflow-y-auto no-scrollbar content-start flex-1 min-h-0 py-1">
              {filteredDishes.map((dish) => {
                const isAssignedHere = dayPlan[activeSlot] === dish.id;

                if (isDeletingDishes) {
                  return (
                    <button
                      key={dish.id}
                      onClick={() => deleteDishFromPantry(dish.id)}
                      className="px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 bg-terracotta-100 text-terracotta-600 border border-terracotta-500/40 hover:bg-terracotta-500 hover:text-white transition"
                      title="Tap to delete dish from pantry"
                    >
                      <span>{dish.emoji}</span>
                      <span>{dish.name}</span>
                      <span className="text-[10px] font-extrabold ml-0.5">✕</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={dish.id}
                    onClick={() => handleSelectDishChip(dish.id)}
                    className={`px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition border ${
                      isAssignedHere
                        ? "bg-olive-600 text-white border-olive-600 shadow-2xs"
                        : "bg-cream-50 text-espresso-900 border-espresso-900/10 hover:border-terracotta-500"
                    }`}
                  >
                    <span>{dish.emoji}</span>
                    <span>{dish.name}</span>
                    {dish.prepRule && (
                      <Zap
                        className={`w-3 h-3 ${
                          isAssignedHere ? "text-amber-100" : "text-terracotta-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-espresso-900/5 text-[10px] text-espresso-700/70 flex justify-between shrink-0">
              <span>
                {isDeletingDishes ? (
                  <strong className="text-terracotta-600">Delete Mode: Tap any dish chip to remove it</strong>
                ) : (
                  <>Target: <strong className="text-terracotta-600 uppercase">{activeSlot}</strong> (Auto-advances on tap)</>
                )}
              </span>
              <span>⚡ = Syncs prep to Today Flow</span>
            </div>
          </div>
        </>
      )}

      {/* SLIDE-UP MODAL: CREATE NEW SAVED DISH + PREP RULE */}
      <BottomSheet
        isOpen={isNewDishOpen}
        onClose={() => setIsNewDishOpen(false)}
        badge="Smart Pantry"
        title="Add New Dish Chip & Prep Rule"
        subtitle="Attach a soaking or thawing reminder once, and never forget again."
        headerClass="bento-meal-gradient"
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={dishEmoji}
              onChange={(e) => setDishEmoji(e.target.value)}
              className="w-12 px-2 py-2 rounded-xl bg-white border border-espresso-900/15 text-center text-base"
              placeholder="🍲"
            />
            <input
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="Dish name (e.g. Ragi Dosa or Prawn Curry)"
              className="flex-1 px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "bfast", label: "🌅 Breakfast" },
              { id: "main", label: "🍗 Lunch/Dinner" },
              { id: "snack", label: "☕ Snack" }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setDishCategory(c.id)}
                className={`py-2 rounded-xl text-xs font-bold border ${
                  dishCategory === c.id
                    ? "bg-espresso-900 text-white border-espresso-900"
                    : "bg-white text-espresso-800 border-espresso-900/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-amber-100/60 border border-amber-500/30 space-y-2">
            <label className="text-xs font-extrabold text-espresso-900 block">
              ⚡ Attach Automatic Prep Reminder:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "night_before", label: "🌙 Night Before" },
                { id: "morning_of", label: "🌅 Morning Of" },
                { id: "none", label: "None" }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPrepTiming(p.id)}
                  className={`py-1.5 rounded-xl text-[11px] font-bold ${
                    prepTiming === p.id
                      ? "bg-terracotta-500 text-white"
                      : "bg-white text-espresso-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {prepTiming !== "none" && (
              <input
                type="text"
                value={prepText}
                onChange={(e) => setPrepText(e.target.value)}
                placeholder="e.g. Soak dal / Thaw chicken breast in fridge..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs"
              />
            )}
          </div>

          <button
            onClick={() => {
              if (!dishName.trim()) return;
              const newId = addDishToPantry({
                name: dishName.trim(),
                emoji: dishEmoji || "🍲",
                category: dishCategory,
                prepTiming,
                prepText
              });
              assignDishToSlot(selectedDay, activeSlot, newId);
              setDishName("");
              setPrepText("");
              setIsNewDishOpen(false);
            }}
            className="w-full py-2.5 rounded-2xl bg-espresso-900 text-cream-50 text-xs font-bold shadow-md"
          >
            Save to Pantry & Assign to {selectedDay}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}