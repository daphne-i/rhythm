import React, { useState } from "react";
import {
  Pill,
  Cake,
  BookOpen,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  Palette
} from "lucide-react";
import { useRhythm } from "../../context/RhythmContext";
import BottomSheet from "./BottomSheet";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const COLOR_THEMES = [
  {
    id: "terracotta",
    name: "🍂 Terracotta Studio",
    subtitle: "Warm parchment canvas, deep espresso & spiced rust",
    swatches: ["#F6EFE4", "#261B16", "#CC582E", "#5C734E"]
  },
  {
    id: "nocturne",
    name: "🌙 Velvet Nocturne (Dark Mode)",
    subtitle: "Full cozy dark mode with obsidian, plum & rose-gold",
    swatches: ["#141118", "#221D2B", "#E67A58", "#9E68C2"]
  },
  {
    id: "berry",
    name: "🍷 Spiced Wine & Blush",
    subtitle: "Tinted dusty-rose canvas, deep mulberry & wine cards",
    swatches: ["#F3E0E8", "#381828", "#BA3260", "#7E3E94"]
  },
  {
    id: "forest",
    name: "🌿 Matcha & Sage Linen",
    subtitle: "Fresh botanical mint canvas, forest sage & warm ochre",
    swatches: ["#EDF4EE", "#2E523E", "#3A8760", "#D4843E"]
  },
  {
    id: "midnight",
    name: "🌊 Nordic Mist & Copper",
    subtitle: "Crisp coastal ice-blue canvas, deep slate & copper",
    swatches: ["#E4EEF7", "#142233", "#D46C38", "#2A82A3"]
  }
];

export default function QuickSettingsSheet({ isOpen, onClose }) {
  const {
    state,
    activeTheme,
    setAppTheme,
    addMedication,
    deleteMedication,
    addBirthday,
    deleteBirthday,
    updateWindDownSlot,
    importFullState
  } = useRhythm();

  const [subTab, setSubTab] = useState("themes");

  // Med Form State
  const [medName, setMedName] = useState("");
  const [medTime, setMedTime] = useState("08:30 AM");
  const [medWindow, setMedWindow] = useState("Morning");
  const [medMealTag, setMedMealTag] = useState("After Meal");

  // Birthday Form State
  const [bdayName, setBdayName] = useState("");
  const [bdayMonth, setBdayMonth] = useState(new Date().getMonth() + 1);
  const [bdayDay, setBdayDay] = useState(new Date().getDate());

  // Wind-Down Form State
  const [windDownTitle, setWindDownTitle] = useState(state.windDownSlot?.title || "");
  const [windDownTag, setWindDownTag] = useState(state.windDownSlot?.tag || "Evening Ritual");
  const [savedToast, setSavedToast] = useState(false);

  // Backup Import State
  const [importStatus, setImportStatus] = useState("");

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rhythm_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const ok = importFullState(parsed);
        setImportStatus(ok ? "✓ Backup restored!" : "Invalid backup file.");
      } catch {
        setImportStatus("Error reading JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      badge="Appearance & Life Anchors"
      title="Themes, Meds, Birthdays & Backup"
      subtitle="Customize your visual palette and daily anchors."
      headerClass="bento-ritual-gradient"
    >
      {/* 5 Sub-Navigation Pills */}
      <div className="grid grid-cols-5 gap-1 bg-cream-200/70 p-1 rounded-2xl mb-3">
        {[
          { id: "themes", label: "Themes", emoji: "🎨" },
          { id: "meds", label: "Meds", emoji: "💊" },
          { id: "bdays", label: "Bdays", emoji: "🎂" },
          { id: "winddown", label: "Hobby", emoji: "🧶" },
          { id: "backup", label: "Backup", emoji: "💾" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSubTab(t.id)}
            className={`py-1.5 rounded-xl text-[10px] font-bold flex flex-col items-center transition ${
              subTab === t.id
                ? "bg-espresso-900 text-cream-50 shadow-xs"
                : "text-espresso-700 hover:bg-white/60"
            }`}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* =========================================================
          SUB-TAB 0: COLOR THEME PALETTE SWITCHER
      ========================================================= */}
      {subTab === "themes" && (
        <div className="space-y-2">
          {COLOR_THEMES.map((theme) => {
            const isSelected = (activeTheme || "terracotta") === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setAppTheme(theme.id)}
                className={`w-full p-3 rounded-2xl border-2 text-left flex items-center justify-between transition ${
                  isSelected
                    ? "bg-white border-terracotta-500 shadow-bento"
                    : "bg-white/70 border-espresso-900/10 hover:bg-white"
                }`}
              >
                <div className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold text-espresso-900">
                      {theme.name}
                    </span>
                    {isSelected && (
                      <span className="px-1.5 py-0.2 rounded-full bg-terracotta-500 text-white text-[9px] font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-espresso-700/80 mt-0.5">
                    {theme.subtitle}
                  </p>
                </div>

                {/* 4 Color Swatch Circles */}
                <div className="flex items-center -space-x-1.5 shrink-0">
                  {theme.swatches.map((hex, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: hex }}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-2xs"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* =========================================================
          SUB-TAB 1: MEDICATIONS & SUPPLEMENTS EDITOR
      ========================================================= */}
      {subTab === "meds" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {state.medications.map((med) => (
              <div
                key={med.id}
                className="p-2.5 rounded-2xl bg-white border border-espresso-900/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-terracotta-100 text-terracotta-600">
                    <Pill className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-espresso-900">{med.name}</p>
                    <p className="text-[10px] text-espresso-700/80 font-semibold">
                      {med.timeWindow} • {med.time} • <span className="text-terracotta-600">{med.mealTag}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteMedication(med.id)}
                  className="p-1.5 rounded-xl text-espresso-700/50 hover:text-terracotta-600 hover:bg-terracotta-100/50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl bg-cream-100 border border-espresso-900/10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-espresso-800">
              + Add Tablet / Supplement
            </p>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="Tablet name (e.g. Iron / Omega-3)"
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
              />
              <input
                type="text"
                value={medTime}
                onChange={(e) => setMedTime(e.target.value)}
                placeholder="08:30 AM"
                className="w-24 px-2 py-1.5 rounded-xl bg-white border border-espresso-900/15 text-xs font-semibold text-center"
              />
            </div>

            <div className="grid grid-cols-3 gap-1">
              {["Morning", "Afternoon", "Night"].map((w) => (
                <button
                  key={w}
                  onClick={() => setMedWindow(w)}
                  className={`py-1 rounded-xl text-[10px] font-bold ${
                    medWindow === w
                      ? "bg-espresso-900 text-white"
                      : "bg-white text-espresso-800 border border-espresso-900/10"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-1">
              {["Before Meal", "With Meal", "After Meal"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setMedMealTag(tag)}
                  className={`py-1 rounded-xl text-[10px] font-bold ${
                    medMealTag === tag
                      ? "bg-terracotta-500 text-white"
                      : "bg-white text-espresso-800 border border-espresso-900/10"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (!medName.trim()) return;
                addMedication({
                  name: medName,
                  time: medTime,
                  timeWindow: medWindow,
                  mealTag: medMealTag
                });
                setMedName("");
              }}
              className="w-full py-2 rounded-xl bg-espresso-900 text-cream-50 text-xs font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Save Medication
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 2: BIRTHDAYS EDITOR
      ========================================================= */}
      {subTab === "bdays" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            {state.birthdays.length === 0 ? (
              <p className="text-xs text-center py-4 text-espresso-700/70">
                No birthdays saved yet. Add one below!
              </p>
            ) : (
              state.birthdays.map((b) => (
                <div
                  key={b.id}
                  className="p-2.5 rounded-2xl bg-white border border-espresso-900/10 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-500">
                      <Cake className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-espresso-900">{b.name}</p>
                      <p className="text-[10px] text-espresso-700/80 font-semibold">
                        Celebrates on {MONTH_NAMES[(b.month || 1) - 1]} {b.day}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteBirthday(b.id)}
                    className="p-1.5 rounded-xl text-espresso-700/50 hover:text-terracotta-600 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-3 rounded-2xl bg-cream-100 border border-espresso-900/10 space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-espresso-800">
              + Add Birthday / Special Day
            </p>
            <input
              type="text"
              value={bdayName}
              onChange={(e) => setBdayName(e.target.value)}
              placeholder="Person's Name"
              className="w-full px-3 py-1.5 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
            />
            <div className="flex gap-2">
              <select
                value={bdayMonth}
                onChange={(e) => setBdayMonth(Number(e.target.value))}
                className="flex-1 px-2.5 py-1.5 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
              >
                {MONTH_NAMES.map((mName, idx) => (
                  <option key={mName} value={idx + 1}>
                    {mName}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                max="31"
                value={bdayDay}
                onChange={(e) => setBdayDay(Number(e.target.value))}
                className="w-20 px-2.5 py-1.5 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold text-center"
                placeholder="Day"
              />
            </div>
            <button
              onClick={() => {
                if (!bdayName.trim()) return;
                addBirthday({ name: bdayName, month: bdayMonth, day: bdayDay });
                setBdayName("");
              }}
              className="w-full py-2 rounded-xl bg-terracotta-500 text-white text-xs font-bold flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Birthday
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 3: EVENING WIND-DOWN & HOBBIES EDITOR
      ========================================================= */}
      {subTab === "winddown" && (
        <div className="p-3.5 rounded-2xl bg-plum-100/60 border border-plum-500/30 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-plum-600 text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-espresso-900">
                Protected Evening Wind-Down Slot
              </h4>
              <p className="text-[10px] text-espresso-700">
                Appears automatically in your Night Flow so hobbies don&apos;t get lost.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold uppercase text-espresso-700 block mb-1">
                Current Book, Craft, or Wind-Down Activity
              </label>
              <input
                type="text"
                value={windDownTitle}
                onChange={(e) => setWindDownTitle(e.target.value)}
                placeholder="e.g. Crochet Sweater (4 rows) or Read 20 pages"
                className="w-full px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-espresso-700 block mb-1">
                Subtitle / Category Tag
              </label>
              <input
                type="text"
                value={windDownTag}
                onChange={(e) => setWindDownTag(e.target.value)}
                placeholder="e.g. Evening Ritual • No Screens"
                className="w-full px-3 py-2 rounded-xl bg-white border border-espresso-900/15 text-xs font-medium"
              />
            </div>

            <button
              onClick={() => {
                if (!windDownTitle.trim()) return;
                updateWindDownSlot(windDownTitle.trim(), windDownTag.trim() || "Evening Ritual");
                setSavedToast(true);
                setTimeout(() => setSavedToast(false), 2000);
              }}
              className="w-full py-2.5 rounded-xl bg-plum-600 text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              {savedToast ? (
                <>
                  <Check className="w-4 h-4" /> Saved to Night Flow!
                </>
              ) : (
                "Save Wind-Down Activity"
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================
          SUB-TAB 4: 1-TAP JSON BACKUP & RESTORE
      ========================================================= */}
      {subTab === "backup" && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-white border border-espresso-900/10 space-y-2">
            <h4 className="text-xs font-bold text-espresso-900">
              Export Your Setup & Logs
            </h4>
            <p className="text-[11px] text-espresso-700">
              Download a `.json` snapshot of all your shelves, skincare cycles, saved dish chips, and trackers.
            </p>
            <button
              onClick={handleExportJSON}
              className="w-full py-2.5 rounded-xl bg-espresso-900 text-cream-50 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-500" /> Download Backup (.json)
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-espresso-900/10 space-y-2">
            <h4 className="text-xs font-bold text-espresso-900">
              Restore from Backup File
            </h4>
            <p className="text-[11px] text-espresso-700">
              Upload your `.json` file to restore everything immediately.
            </p>
            <label className="w-full py-2.5 rounded-xl bg-cream-200 hover:bg-cream-200/80 text-espresso-900 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> Choose Backup File
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
            {importStatus && (
              <p className="text-xs font-bold text-olive-600 text-center mt-1">
                {importStatus}
              </p>
            )}
          </div>
        </div>
      )}
    </BottomSheet>
  );
}