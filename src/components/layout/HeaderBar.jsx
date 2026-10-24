import React from "react";
import { ShoppingBag, Inbox, Cake, Phone, MessageCircle, Settings } from "lucide-react";
import { useRhythm } from "../../context/RhythmContext";
import { addDays, formatDateKey, getWeekdayName } from "../../utils/cycleEngine";

export default function HeaderBar({ onOpenSheet }) {
  const { state, selectedDate, setSelectedDate } = useRhythm();

  const todayStr = formatDateKey(new Date());
  const weekDates = [-2, -1, 0, 1, 2, 3, 4].map((offset) => {
    const dStr = addDays(todayStr, offset);
    const dayNum = dStr.split("-")[2];
    return {
      dateStr: dStr,
      weekday: getWeekdayName(dStr),
      dayNum,
      isToday: dStr === todayStr
    };
  });

  const lowStockCount = Object.values(state.shelfItems).filter((i) => i.isLowStock).length;
  const pendingUnloadCount = state.mindUnload.filter((t) => !t.done).length;

  const [, selMonth, selDay] = selectedDate.split("-").map(Number);
  const todaysBirthday = state.birthdays.find(
    (b) => b.month === selMonth && b.day === selDay
  );

  return (
    <header className="px-4 pt-3 pb-2 bg-espresso-900 text-cream-50 rounded-b-3xl shadow-md shrink-0">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-terracotta-500 ring-4 ring-terracotta-500/20" />
          <span className="font-bold tracking-tight text-sm text-cream-100">
            RHYTHM
          </span>
          <span className="text-[11px] text-cream-200/60 font-medium">
            • {selectedDate === todayStr ? "Today" : selectedDate}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Restock Pill */}
          <button
            onClick={() => onOpenSheet("restock")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-espresso-800 hover:bg-espresso-700 border border-white/10 text-xs font-semibold transition"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
            <span>Low</span>
            {lowStockCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-terracotta-500 text-white text-[10px] font-bold">
                {lowStockCount}
              </span>
            )}
          </button>

          {/* Mind Unload Pill */}
          <button
            onClick={() => onOpenSheet("unload")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-espresso-800 hover:bg-espresso-700 border border-white/10 text-xs font-semibold transition"
          >
            <Inbox className="w-3.5 h-3.5 text-teal-100" />
            <span>Unload</span>
            {pendingUnloadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-olive-500 text-white text-[10px] font-bold">
                {pendingUnloadCount}
              </span>
            )}
          </button>

          {/* NEW: Quick Anchors & Settings Gear Button */}
          <button
            onClick={() => onOpenSheet("settings")}
            className="p-1.5 rounded-full bg-espresso-800 hover:bg-espresso-700 border border-white/10 text-cream-100 transition"
            title="Edit Meds, Birthdays, Wind-Down & Backup"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Interactive Pill Strip */}
      <div className="grid grid-cols-7 gap-1">
        {weekDates.map((d) => {
          const isSelected = d.dateStr === selectedDate;
          return (
            <button
              key={d.dateStr}
              onClick={() => setSelectedDate(d.dateStr)}
              className={`flex flex-col items-center py-1.5 rounded-2xl transition-all ${
                isSelected
                  ? "bg-terracotta-500 text-white shadow-sm scale-[1.03]"
                  : "bg-espresso-800/70 text-cream-200/75 hover:bg-espresso-800"
              }`}
            >
              <span className="text-[10px] uppercase font-semibold tracking-wider opacity-80">
                {d.weekday}
              </span>
              <span className="text-xs font-bold mt-0.5">{d.dayNum}</span>
              {d.isToday && (
                <span
                  className={`w-1 h-1 rounded-full mt-0.5 ${
                    isSelected ? "bg-white" : "bg-terracotta-500"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Auto-Appearing Birthday Celebration Strip */}
      {todaysBirthday && (
        <div className="mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/25 via-terracotta-500/25 to-plum-500/25 border border-amber-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cake className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-semibold text-cream-50">
              {todaysBirthday.name}&apos;s Birthday Today!
            </span>
          </div>
          <div className="flex items-center gap-1">
            <a
              href="sms:"
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100"
              title="Send Wish"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
            <a
              href="tel:"
              className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-100"
              title="Call"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}