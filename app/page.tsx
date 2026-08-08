"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { EXERCISES, type Exercise, type SceneId } from "./data/exercises";

type Hand = "left" | "right" | "thumb";
type Finger = "pinky" | "ring" | "middle" | "index" | "thumb";
type Screen = "scenes" | "practice" | "result";

type KeyInfo = {
  hand: Hand;
  finger: Finger;
  label: string;
  homeKey: string;
  zone: string;
  number: number;
  physicalKey: string;
  shift?: boolean;
};

type SessionRecord = {
  id: string;
  date: string;
  scene: string;
  accuracy: number;
  correct: number;
  exerciseCount: number;
  mistakes: Record<string, number>;
  targetFingerErrors: Record<string, number>;
};

type Settings = {
  sound: boolean;
  animation: boolean;
  largeGuide: boolean;
  exerciseCount: number;
  fontScale: number;
};

const HISTORY_KEY = "yubitore-history-v2";
const SETTINGS_KEY = "yubitore-settings-v2";

const DEFAULT_SETTINGS: Settings = {
  sound: false,
  animation: true,
  largeGuide: true,
  exerciseCount: 5,
  fontScale: 1,
};

const KEYS: Record<string, KeyInfo> = {
  q: { hand: "left", finger: "pinky", label: "左手の小指", homeKey: "a", zone: "Q・A・Z", number: 1, physicalKey: "q" },
  a: { hand: "left", finger: "pinky", label: "左手の小指", homeKey: "a", zone: "Q・A・Z", number: 1, physicalKey: "a" },
  z: { hand: "left", finger: "pinky", label: "左手の小指", homeKey: "a", zone: "Q・A・Z", number: 1, physicalKey: "z" },
  w: { hand: "left", finger: "ring", label: "左手の薬指", homeKey: "s", zone: "W・S・X", number: 2, physicalKey: "w" },
  s: { hand: "left", finger: "ring", label: "左手の薬指", homeKey: "s", zone: "W・S・X", number: 2, physicalKey: "s" },
  x: { hand: "left", finger: "ring", label: "左手の薬指", homeKey: "s", zone: "W・S・X", number: 2, physicalKey: "x" },
  e: { hand: "left", finger: "middle", label: "左手の中指", homeKey: "d", zone: "E・D・C", number: 3, physicalKey: "e" },
  d: { hand: "left", finger: "middle", label: "左手の中指", homeKey: "d", zone: "E・D・C", number: 3, physicalKey: "d" },
  c: { hand: "left", finger: "middle", label: "左手の中指", homeKey: "d", zone: "E・D・C", number: 3, physicalKey: "c" },
  r: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "r" },
  t: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "t" },
  f: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "f" },
  g: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "g" },
  v: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "v" },
  b: { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "R・T・F・G・V・B", number: 4, physicalKey: "b" },
  y: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "y" },
  u: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "u" },
  h: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "h" },
  j: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "j" },
  n: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "n" },
  m: { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "Y・U・H・J・N・M", number: 4, physicalKey: "m" },
  i: { hand: "right", finger: "middle", label: "右手の中指", homeKey: "k", zone: "I・K・,", number: 3, physicalKey: "i" },
  k: { hand: "right", finger: "middle", label: "右手の中指", homeKey: "k", zone: "I・K・,", number: 3, physicalKey: "k" },
  ",": { hand: "right", finger: "middle", label: "右手の中指", homeKey: "k", zone: "I・K・,", number: 3, physicalKey: "," },
  o: { hand: "right", finger: "ring", label: "右手の薬指", homeKey: "l", zone: "O・L・.", number: 2, physicalKey: "o" },
  l: { hand: "right", finger: "ring", label: "右手の薬指", homeKey: "l", zone: "O・L・.", number: 2, physicalKey: "l" },
  ".": { hand: "right", finger: "ring", label: "右手の薬指", homeKey: "l", zone: "O・L・.", number: 2, physicalKey: "." },
  p: { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "P・;・/", number: 1, physicalKey: "p" },
  ";": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "P・;・/", number: 1, physicalKey: ";" },
  ":": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: ":・*・]", number: 1, physicalKey: ":" },
  "/": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "P・;・/", number: 1, physicalKey: "/" },
  "[": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "[・]・{・}", number: 1, physicalKey: "[" },
  "]": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "[・]・{・}", number: 1, physicalKey: "]" },
  "-": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "0・-・^", number: 1, physicalKey: "-" },
  " ": { hand: "thumb", finger: "thumb", label: "親指", homeKey: " ", zone: "Space", number: 5, physicalKey: " " },
  "\n": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "Enter", number: 1, physicalKey: "Enter" },
};

const SCENES: Record<SceneId, { title: string; subtitle: string; mark: string }> = {
  mail: { title: "業務メール", subtitle: "確認・依頼・お礼など、仕事でよく使う文章", mark: "✉" },
  meeting: { title: "会議メモ", subtitle: "日時・決定事項・次の行動を記録する文章", mark: "▤" },
  chat: { title: "チャット返信", subtitle: "短く自然な返答を、流れを切らずに入力", mark: "○" },
  document: { title: "文書作成", subtitle: "説明・報告・提案の文章をまとまりで入力", mark: "文" },
  hello: { title: "クラスとmain", subtitle: "Javaプログラムの基本構造と標準出力", mark: "01" },
  variables: { title: "変数と型", subtitle: "int・double・Stringと代入、計算", mark: "02" },
  condition: { title: "条件分岐", subtitle: "if・elseと比較演算子、論理値", mark: "03" },
  loop: { title: "繰り返し", subtitle: "for・whileとインクリメント", mark: "04" },
  method: { title: "メソッド", subtitle: "引数・戻り値・メソッド呼び出し", mark: "05" },
};

const PRACTICAL_SCENES: SceneId[] = ["mail", "meeting", "chat", "document"];
const JAVA_SCENES: SceneId[] = ["hello", "variables", "condition", "loop", "method"];

function isJavaScene(scene: SceneId) {
  return JAVA_SCENES.includes(scene);
}

const KEYBOARD_ROWS = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", ":"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "[", "]", ";"],
];

const NUMBER_KEYS: Record<string, KeyInfo> = {
  "1": { hand: "left", finger: "pinky", label: "左手の小指", homeKey: "a", zone: "1・Q・A・Z", number: 1, physicalKey: "1" },
  "2": { hand: "left", finger: "ring", label: "左手の薬指", homeKey: "s", zone: "2・W・S・X", number: 2, physicalKey: "2" },
  "3": { hand: "left", finger: "middle", label: "左手の中指", homeKey: "d", zone: "3・E・D・C", number: 3, physicalKey: "3" },
  "4": { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "4・5・R・T", number: 4, physicalKey: "4" },
  "5": { hand: "left", finger: "index", label: "左手の人差し指", homeKey: "f", zone: "4・5・R・T", number: 4, physicalKey: "5" },
  "6": { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "6・7・Y・U", number: 4, physicalKey: "6" },
  "7": { hand: "right", finger: "index", label: "右手の人差し指", homeKey: "j", zone: "6・7・Y・U", number: 4, physicalKey: "7" },
  "8": { hand: "right", finger: "middle", label: "右手の中指", homeKey: "k", zone: "8・I・K", number: 3, physicalKey: "8" },
  "9": { hand: "right", finger: "ring", label: "右手の薬指", homeKey: "l", zone: "9・O・L", number: 2, physicalKey: "9" },
  "0": { hand: "right", finger: "pinky", label: "右手の小指", homeKey: ";", zone: "0・P・;", number: 1, physicalKey: "0" },
};

const SHIFT_SYMBOLS: Record<string, string> = {
  "!": "1",
  '"': "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "&": "6",
  "'": "7",
  "(": "8",
  ")": "9",
  "=": "-",
  "+": ";",
  "*": ":",
  "<": ",",
  ">": ".",
  "?": "/",
  "{": "[",
  "}": "]",
};

function getKeyInfo(char: string): KeyInfo {
  if (KEYS[char]) return KEYS[char];
  if (NUMBER_KEYS[char]) return NUMBER_KEYS[char];
  if (/^[A-Z]$/.test(char)) {
    return { ...KEYS[char.toLowerCase()], shift: true };
  }
  const physicalKey = SHIFT_SYMBOLS[char];
  if (physicalKey) {
    const base = KEYS[physicalKey] || NUMBER_KEYS[physicalKey];
    return { ...base, physicalKey, shift: true };
  }
  return KEYS.a;
}

function hasKeyInfo(char: string) {
  return Boolean(
    KEYS[char] ||
      NUMBER_KEYS[char] ||
      /^[A-Z]$/.test(char) ||
      SHIFT_SYMBOLS[char],
  );
}

function shiftSide(info: KeyInfo) {
  if (!info.shift) return null;
  return info.hand === "left" ? "右Shift" : "左Shift";
}

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function displayKey(key: string) {
  if (key === " ") return "Space";
  if (key === "\n") return "Enter";
  if (key.length === 1 && !/[a-z]/.test(key)) return key;
  return key.toUpperCase();
}

function sortedMistakes(mistakes: Record<string, number>) {
  return Object.entries(mistakes).sort((a, b) => b[1] - a[1]);
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand" onClick={onClick} aria-label="練習メニューへ">
      <span className="brand-name">
        <b>ゆっくり</b>
        <strong>タイピング</strong>
        <i aria-hidden="true" />
      </span>
      <small>文章やコードを打ちながら、指だけ整える</small>
    </button>
  );
}

function HandMap({ info }: { info: KeyInfo }) {
  const names: { hand: "left" | "right"; fingers: Finger[] }[] = [
    { hand: "left", fingers: ["pinky", "ring", "middle", "index"] },
    { hand: "right", fingers: ["index", "middle", "ring", "pinky"] },
  ];
  return (
    <div className="hand-map" role="img" aria-label={`${info.label}を強調した手の図`}>
      {names.map(({ hand, fingers }) => {
        const isThumbTarget = info.finger === "thumb";
        return (
          <div
            className={`guide-hand ${hand} ${info.hand !== hand && info.hand !== "thumb" ? "muted" : ""}`}
            key={hand}
          >
            <div className="guide-palm"><span>{hand === "left" ? "左手" : "右手"}</span></div>
            <div className="guide-fingers">
              {fingers.map((finger) => {
                const isTarget = info.finger === finger && info.hand === hand;
                return (
                  <i className={`${finger} ${isTarget ? "target" : ""}`} key={`${hand}-${finger}`}>
                    {isTarget && (
                      <>
                        <span>この指</span>
                        <b>{info.number}</b>
                      </>
                    )}
                  </i>
                );
              })}
            </div>
            <i className={`guide-thumb ${isThumbTarget ? "target" : ""}`}>
              {isThumbTarget && (
                <>
                  <span>この指</span>
                  <b>{info.number}</b>
                </>
              )}
            </i>
          </div>
        );
      })}
    </div>
  );
}

function KeyboardMap({
  target,
  info,
  wrong,
}: {
  target: string;
  info: KeyInfo;
  wrong: string | null;
}) {
  const wrongPhysical = wrong ? getKeyInfo(wrong).physicalKey : null;
  return (
    <div className="keyboard-map" role="img" aria-label={`${displayKey(target)}キーを強調したキーボード`}>
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div className={`keyboard-row row-${rowIndex + 1}`} key={rowIndex}>
          {row.map((key) => (
            <span
              className={`${key === info.physicalKey ? "target" : ""} ${key === wrongPhysical ? "wrong" : ""} ${
                key === "f" || key === "j" ? "home" : ""
              }`}
              key={key}
            >
              {displayKey(key)}
              {key === info.physicalKey && <b aria-hidden="true">◎</b>}
              {key === wrongPhysical && <b aria-hidden="true">×</b>}
            </span>
          ))}
        </div>
      ))}
      <div className="keyboard-row modifier-row">
        <span className={`shift ${shiftSide(info) === "左Shift" ? "target" : ""}`}>Shift</span>
        <span className={`space ${info.physicalKey === " " ? "target" : ""}`}>
          Space {target === " " && <b aria-hidden="true">◎</b>}
        </span>
        <span className={`shift ${shiftSide(info) === "右Shift" ? "target" : ""}`}>Shift</span>
        <span className={info.physicalKey === "Enter" ? "target enter" : "enter"}>Enter</span>
      </div>
    </div>
  );
}

function exerciseCountLabel(count: number, max: number) {
  if (count === max) return "全問";
  if (count === 1) return "短め";
  if (count === 2) return "軽め";
  if (count <= 4) return "標準";
  if (count <= 6) return "しっかり";
  if (count <= 9) return "多め";
  return "たっぷり";
}

function SettingsPanel({
  settings,
  maxExerciseCount,
  onChange,
  onClose,
}: {
  settings: Settings;
  maxExerciseCount: number;
  onChange: (settings: Settings) => void;
  onClose: () => void;
}) {
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <section className="panel-modal">
        <div className="modal-heading">
          <div>
            <p className="eyebrow">表示と練習量</p>
            <h2 id="settings-title">設定</h2>
          </div>
          <button onClick={onClose} aria-label="設定を閉じる">×</button>
        </div>
        <label>
          1回の課題数
          <select
            value={Math.min(settings.exerciseCount, maxExerciseCount)}
            onChange={(event) => onChange({ ...settings, exerciseCount: Number(event.target.value) })}
          >
            {Array.from({ length: maxExerciseCount }, (_, index) => index + 1).map((count) => (
              <option value={count} key={count}>{count}題・{exerciseCountLabel(count, maxExerciseCount)}</option>
            ))}
          </select>
        </label>
        <label>
          文字の大きさ
          <input
            type="range"
            min="0.9"
            max="1.2"
            step="0.1"
            value={settings.fontScale}
            onChange={(event) => onChange({ ...settings, fontScale: Number(event.target.value) })}
          />
          <small>{Math.round(settings.fontScale * 100)}%</small>
        </label>
        <button
          className={`switch-row ${settings.largeGuide ? "on" : ""}`}
          role="switch"
          aria-checked={settings.largeGuide}
          onClick={() => onChange({ ...settings, largeGuide: !settings.largeGuide })}
        >
          <span><strong>指ガイドを大きく表示</strong><small>入力中は画面中央で確認できます</small></span>
          <i aria-hidden="true" />
        </button>
        <button
          className={`switch-row ${settings.sound ? "on" : ""}`}
          role="switch"
          aria-checked={settings.sound}
          onClick={() => onChange({ ...settings, sound: !settings.sound })}
        >
          <span><strong>控えめな効果音</strong><small>キーの正誤を短い音で知らせます</small></span>
          <i aria-hidden="true" />
        </button>
        <button
          className={`switch-row ${settings.animation ? "on" : ""}`}
          role="switch"
          aria-checked={settings.animation}
          onClick={() => onChange({ ...settings, animation: !settings.animation })}
        >
          <span><strong>穏やかなアニメーション</strong><small>対象の指をゆっくり強調します</small></span>
          <i aria-hidden="true" />
        </button>
        <button className="primary-button" onClick={onClose}>保存して閉じる</button>
      </section>
    </div>
  );
}

function PracticePreview({
  exercise,
  sceneTitle,
  exerciseCount,
  onStart,
  onClose,
}: {
  exercise: Exercise;
  sceneTitle: string;
  exerciseCount: number;
  onStart: () => void;
  onClose: () => void;
}) {
  return (
    <div className="overlay preview-overlay" role="dialog" aria-modal="true" aria-labelledby="preview-title">
      <section className="practice-preview">
        <p className="eyebrow">{sceneTitle}・全{exerciseCount}文</p>
        <h2 id="preview-title">最初の文章を確認しましょう</h2>
        <p className="preview-lead">意味と流れをつかんでから、落ち着いて入力を始めます。</p>
        <div className="preview-paper">
          <span>{exercise.context}</span>
          <blockquote>{exercise.description}</blockquote>
        </div>
        <div className="preview-actions">
          <button className="primary-button" onClick={onStart}>確認したので始める →</button>
          <button className="text-button" onClick={onClose}>練習メニューへ戻る</button>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("scenes");
  const [scene, setScene] = useState<SceneId>("mail");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [targetFingerErrors, setTargetFingerErrors] = useState<Record<string, number>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState<SessionRecord | null>(null);
  const wrongTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const task = window.setTimeout(() => {
      setSettings({ ...DEFAULT_SETTINGS, ...readStorage<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS) });
      setHistory(readStorage<SessionRecord[]>(HISTORY_KEY, []));
    }, 0);
    return () => window.clearTimeout(task);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const availableExerciseCount = EXERCISES[scene].length;
  const selectedExerciseCount = Math.min(settings.exerciseCount, availableExerciseCount);
  const exercises = useMemo<Exercise[]>(() => {
    return EXERCISES[scene].slice(0, selectedExerciseCount);
  }, [scene, selectedExerciseCount]);

  const exercise = exercises[exerciseIndex] || exercises[0];
  const target = exercise?.input[charIndex] || "";
  const targetInfo = getKeyInfo(target);
  const fingerNameParts = targetInfo.label.split("の");
  const activeHandLabel = targetInfo.hand === "thumb" ? "左右の手" : fingerNameParts[0];
  const activeFingerLabel = targetInfo.hand === "thumb" ? "親指" : fingerNameParts[1];
  const totalLength = useMemo(() => exercises.reduce((sum, item) => sum + item.input.length, 0), [exercises]);
  const completedLength = useMemo(
    () => exercises.slice(0, exerciseIndex).reduce((sum, item) => sum + item.input.length, 0) + charIndex,
    [charIndex, exerciseIndex, exercises],
  );
  const playTone = useCallback(
    (isCorrect: boolean) => {
      if (!settings.sound) return;
      try {
        const AudioContextClass =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!AudioContextClass) return;
        const context = new AudioContextClass();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = isCorrect ? 470 : 190;
        gain.gain.value = isCorrect ? 0.018 : 0.026;
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.045);
      } catch {
        // Visual feedback remains available.
      }
    },
    [settings.sound],
  );

  const finishSession = useCallback(
    (
      finalCorrect: number,
      finalMistakes: Record<string, number>,
      finalFingerErrors: Record<string, number>,
    ) => {
      const errorCount = Object.values(finalMistakes).reduce((sum, count) => sum + count, 0);
      const attempts = finalCorrect + errorCount;
      const record: SessionRecord = {
        id: `session-${Date.now()}`,
        date: new Date().toISOString(),
        scene: SCENES[scene].title,
        accuracy: attempts ? Math.round((finalCorrect / attempts) * 100) : 100,
        correct: finalCorrect,
        exerciseCount: exercises.length,
        mistakes: finalMistakes,
        targetFingerErrors: finalFingerErrors,
      };
      setResult(record);
      setHistory((items) => [record, ...items].slice(0, 40));
      setScreen("result");
    },
    [exercises.length, scene],
  );

  const advance = useCallback(
    (
      nextCorrect: number,
      nextMistakes: Record<string, number>,
      nextFingerErrors: Record<string, number>,
    ) => {
      if (charIndex + 1 < exercise.input.length) {
        setCharIndex((value) => value + 1);
        return;
      }
      if (exerciseIndex + 1 < exercises.length) {
        setExerciseIndex((value) => value + 1);
        setCharIndex(0);
        return;
      }
      finishSession(nextCorrect, nextMistakes, nextFingerErrors);
    },
    [charIndex, exercise.input.length, exerciseIndex, exercises.length, finishSession],
  );

  useEffect(() => {
    if (screen !== "practice" || paused || settingsOpen || historyOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        setPaused(true);
        return;
      }
      if (event.key === "Tab") return;

      const key =
        event.key === "Enter"
          ? "\n"
          : event.key === "Spacebar"
            ? " "
            : event.key;
      if (!hasKeyInfo(key)) return;
      event.preventDefault();

      if (key === target) {
        const nextCorrect = correct + 1;
        setCorrect(nextCorrect);
        setWrongKey(null);
        playTone(true);
        advance(nextCorrect, mistakes, targetFingerErrors);
        return;
      }

      const nextMistakes = { ...mistakes, [key]: (mistakes[key] || 0) + 1 };
      const nextFingerErrors = {
        ...targetFingerErrors,
        [targetInfo.label]: (targetFingerErrors[targetInfo.label] || 0) + 1,
      };
      setMistakes(nextMistakes);
      setTargetFingerErrors(nextFingerErrors);
      setWrongKey(key);
      playTone(false);
      if (wrongTimer.current) window.clearTimeout(wrongTimer.current);
      wrongTimer.current = window.setTimeout(() => setWrongKey(null), 650);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    advance,
    correct,
    historyOpen,
    mistakes,
    paused,
    playTone,
    screen,
    settingsOpen,
    target,
    targetFingerErrors,
    targetInfo.label,
  ]);

  useEffect(
    () => () => {
      if (wrongTimer.current) window.clearTimeout(wrongTimer.current);
    },
    [],
  );

  const startPractice = () => {
    setExerciseIndex(0);
    setCharIndex(0);
    setCorrect(0);
    setMistakes({});
    setTargetFingerErrors({});
    setWrongKey(null);
    setPaused(false);
    setResult(null);
    setScreen("practice");
  };

  const requestPracticeStart = () => {
    if (isJavaScene(scene)) {
      startPractice();
      return;
    }
    setPreviewOpen(true);
  };

  const goToScenes = () => {
    setPaused(false);
    setPreviewOpen(false);
    setScreen("scenes");
  };

  const style = { "--font-scale": settings.fontScale } as React.CSSProperties;

  return (
    <main
      className={`${settings.animation ? "" : "no-animation"} ${settings.largeGuide ? "large-guide" : "compact-guide"} ${screen === "practice" ? "practice-mode" : ""} ${screen === "practice" && isJavaScene(scene) ? "java-practice" : ""}`}
      style={style}
    >
      <div className="desktop-note">
        物理キーボードを接続したPCでご利用ください。
      </div>

      <header className="site-header">
        <Brand onClick={goToScenes} />
        <nav aria-label="メインメニュー">
          <button onClick={() => setHistoryOpen(true)}>練習履歴</button>
          <button onClick={() => setSettingsOpen(true)}>設定</button>
        </nav>
      </header>

      {screen === "scenes" && (
        <div className="page-shell inner-page">
          <div className="page-title">
            <p className="eyebrow">練習メニュー</p>
            <h1>練習を選ぶ</h1>
          </div>

          <section className="scene-start-bar" aria-label="選択中の練習">
            <div>
              <span className="section-label">選択中</span>
              <strong>{SCENES[scene].title}</strong>
              <small>
                {exercises[0].context}・{exercises.length} / {availableExerciseCount}{isJavaScene(scene) ? "本" : "文"}
              </small>
            </div>
            <div className="scene-start-actions">
              <button className="primary-button" onClick={requestPracticeStart}>
                {isJavaScene(scene) ? `${SCENES[scene].title}を始める →` : "文章を確認して始める →"}
              </button>
              <button onClick={() => setSettingsOpen(true)}>練習量を変更</button>
            </div>
          </section>

          <section className="practice-collection">
            <div className="collection-heading">
              <div><span>01</span><h2>実務文章</h2></div>
              <p>仕事でよく使う日本語をローマ字で入力</p>
            </div>
            <div className="scene-grid practical-grid">
              {PRACTICAL_SCENES.map((id) => (
                <button
                  className={`scene-card ${scene === id ? "selected" : ""}`}
                  onClick={() => setScene(id)}
                  aria-pressed={scene === id}
                  key={id}
                >
                  <span>{SCENES[id].mark}</span>
                  <div>
                    <strong>{SCENES[id].title}</strong>
                    <small>{SCENES[id].subtitle}</small>
                    <em>{EXERCISES[id].length}文収録</em>
                  </div>
                  <i aria-hidden="true">{scene === id ? "✓" : "→"}</i>
                </button>
              ))}
            </div>
          </section>

          <section className="practice-collection java-collection">
            <div className="collection-heading">
              <div><span>02</span><h2>Java編</h2></div>
              <p>記号・数字・Shift・Enterまで含むコード写経</p>
            </div>
            <div className="scene-grid">
              {JAVA_SCENES.map((id) => (
                <button
                  className={`scene-card java-card ${scene === id ? "selected" : ""}`}
                  onClick={() => setScene(id)}
                  aria-pressed={scene === id}
                  key={id}
                >
                  <span>{SCENES[id].mark}</span>
                  <div>
                    <strong>{SCENES[id].title}</strong>
                    <small>{SCENES[id].subtitle}</small>
                    <em>{EXERCISES[id].length}本収録</em>
                  </div>
                  <i aria-hidden="true">{scene === id ? "✓" : "→"}</i>
                </button>
              ))}
            </div>
          </section>

        </div>
      )}

      {screen === "practice" && exercise && (
        <div className="practice-shell">
          <div className="practice-toolbar">
            <div>
              <strong>{isJavaScene(scene) ? `Java編・${SCENES[scene].title}` : SCENES[scene].title}</strong>
              <span>{exerciseIndex + 1} / {exercises.length} {isJavaScene(scene) ? "本目" : "文目"}</span>
            </div>
            <div className="progress-bar" aria-label={`練習全体の進捗 ${completedLength} / ${totalLength}`}>
              <i style={{ width: `${(completedLength / totalLength) * 100}%` }} />
            </div>
            <button onClick={() => setPaused(true)}>Ⅱ 一時停止</button>
          </div>

          <div className="practice-layout">
            <aside className="finger-rail" aria-label="次に使う指とキーのガイド">
              <div className="finger-priority">
                <div className="finger-priority-heading">
                  <span>最優先：次に使う指</span>
                  <small>指番号 {targetInfo.number}</small>
                </div>
                <div className="finger-name">
                  <strong>{activeHandLabel}</strong>
                  <b>{activeFingerLabel}</b>
                </div>
                <HandMap info={targetInfo} />
                <div className="finger-support">
                  <div className="finger-zone">
                    <span>この指の担当</span>
                    <strong>{targetInfo.zone}</strong>
                  </div>
                  <div className="current-guide">
                    <span>次のキー操作</span>
                    <div className="key-and-finger">
                      <b className={displayKey(target).length > 2 ? "word-key" : ""}>{displayKey(target)}</b>
                      <div>
                        <strong>
                          {targetInfo.shift
                            ? `${shiftSide(targetInfo)} + ${displayKey(targetInfo.physicalKey)}`
                            : displayKey(targetInfo.physicalKey)}
                        </strong>
                        <small>
                          {target === targetInfo.homeKey
                            ? "ホーム位置から押す"
                            : `押したら ${displayKey(targetInfo.homeKey)} へ戻す`}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <KeyboardMap target={target} info={targetInfo} wrong={wrongKey} />
              <div className="rail-legend">
                <span><i className="target-mark" /> 今のキー</span>
                <span><i className="home-mark" /> F・Jの突起</span>
              </div>
            </aside>

            <section className="writing-desk">
              <header>
                <div>
                  <span className="section-label">{isJavaScene(scene) ? "Java写経" : "実務文章"}</span>
                  <small>{exercise.context}</small>
                </div>
              </header>

              <div className="source-code">
                <span className="section-label">{isJavaScene(scene) ? "写経するコード" : "入力する文"}</span>
                {isJavaScene(scene) ? (
                  <>
                    <p>{exercise.description}</p>
                    <pre className="tracked-source" aria-label={`写経するJavaコード ${exercise.input}`}>
                      {exercise.input.split("").map((char, index) => (
                        <span
                          className={`${index < charIndex ? "done" : ""} ${index === charIndex ? "current" : ""}`}
                          key={`${char}-${index}`}
                        >
                          {char === "\n" ? (index === charIndex ? "↵\n" : "\n") : char}
                        </span>
                      ))}
                    </pre>
                  </>
                ) : (
                  <>
                    <p>{exercise.context}</p>
                    <strong>{exercise.description}</strong>
                  </>
                )}
              </div>

              <div className="up-next">
                <span className="section-label">{isJavaScene(scene) ? "次のスニペット" : "次の文章"}</span>
                {exercises[exerciseIndex + 1] ? (
                  <p>{exercises[exerciseIndex + 1].context}</p>
                ) : (
                  <p>{isJavaScene(scene) ? "この構文の写経はこれで終わりです。" : "この文章練習はこれで終わりです。"}</p>
                )}
              </div>

              <div className="input-tracker">
                <div className="roman-label">
                  <span>{isJavaScene(scene) ? "入力位置" : "ローマ字の入力状況"}</span>
                  <small>{charIndex} / {exercise.input.length}文字</small>
                </div>
                {!isJavaScene(scene) && (
                  <div
                    className={`typed-romaji ${wrongKey ? "has-error" : ""}`}
                    role="status"
                    aria-live="polite"
                    aria-label={`入力済みのローマ字 ${exercise.input.slice(0, charIndex) || "なし"}`}
                  >
                    <span>
                      {charIndex > 30 && <small aria-hidden="true">…</small>}
                      {exercise.input.slice(Math.max(0, charIndex - 30), charIndex) || <em>入力した文字がここに表示されます</em>}
                    </span>
                    <i aria-hidden="true" />
                    {wrongKey && <b>× {displayKey(wrongKey)}</b>}
                  </div>
                )}
                <div
                  className="roman-line code-input"
                  aria-label={`${isJavaScene(scene) ? "入力するJavaコード" : "入力するローマ字"} ${exercise.input}`}
                >
                  {exercise.input.split("").map((char, index) => (
                    <span
                      className={`${index < charIndex ? "done" : ""} ${index === charIndex ? "current" : ""}`}
                      key={`${char}-${index}`}
                    >
                      {char === "\n" ? "↵\n" : char === " " ? "·" : char}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {paused && (
            <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
              <section className="pause-modal">
                <span aria-hidden="true">☕</span>
                <h2 id="pause-title">一時停止</h2>
                <p>入力位置はそのまま保存されています。</p>
                <button className="primary-button" onClick={() => setPaused(false)}>入力を再開</button>
                <button className="secondary-button" onClick={startPractice}>最初からやり直す</button>
                <button className="text-button" onClick={goToScenes}>練習を終了</button>
              </section>
            </div>
          )}
        </div>
      )}

      {screen === "result" && result && (
        <div className="page-shell result-page">
          <div className="result-title">
            <p className="eyebrow">{isJavaScene(scene) ? "Javaコードの写経が終わりました" : "文章の入力が終わりました"}</p>
            <h1>練習が完了しました。</h1>
            <p>
              誤入力が多かったキーと、その文字を担当する指を確認できます。
            </p>
          </div>

          <section className="result-stats">
            <article><span>正確率</span><strong>{result.accuracy}<small>%</small></strong><p>{result.correct}文字を入力</p></article>
            <article><span>誤入力</span><strong>{Object.values(result.mistakes).reduce((a, b) => a + b, 0)}<small>回</small></strong><p>正しいキーを押すまで進みません</p></article>
            <article><span>完了数</span><strong>{result.exerciseCount}<small>{isJavaScene(scene) ? "本" : "文"}</small></strong><p>{isJavaScene(scene) ? "コード" : "文章"}の練習を完了</p></article>
          </section>

          <section className="analysis-card">
            <div>
              <span className="section-label">間違いが多かったキー</span>
              <div className="result-keys">
                {sortedMistakes(result.mistakes).length ? (
                  sortedMistakes(result.mistakes).slice(0, 5).map(([key, count]) => (
                    <span key={key}><b>{displayKey(key)}</b><small>{count}回</small></span>
                  ))
                ) : (
                  <strong>誤入力はありませんでした</strong>
                )}
              </div>
            </div>
            <div>
              <span className="section-label">担当指別の誤入力</span>
              <div className="finger-error-list">
                {Object.entries(result.targetFingerErrors).length ? (
                  Object.entries(result.targetFingerErrors)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 4)
                    .map(([label, count]) => (
                      <p key={label}><span>{label}</span><i><b style={{ width: `${Math.min(100, count * 18)}%` }} /></i><small>{count}回</small></p>
                    ))
                ) : (
                  <strong>担当指に偏った誤入力はありませんでした</strong>
                )}
              </div>
              <p className="analysis-note">これは実際に使った指の判定ではなく、間違えた文字の本来の担当指です。</p>
            </div>
          </section>

          <div className="result-actions">
            <button className="primary-button" onClick={requestPracticeStart}>{isJavaScene(scene) ? "同じ構文をもう一度" : "同じ文章をもう一度"}</button>
            <button className="secondary-button" onClick={() => setScreen("scenes")}>別の練習を選ぶ</button>
            <button className="text-button" onClick={goToScenes}>練習メニューへ</button>
          </div>
          <aside className="safety-note">手をキーボードから離し、指と肩を休ませましょう。</aside>
        </div>
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          maxExerciseCount={availableExerciseCount}
          onChange={setSettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {previewOpen && !isJavaScene(scene) && exercises[0] && (
        <PracticePreview
          exercise={exercises[0]}
          sceneTitle={SCENES[scene].title}
          exerciseCount={exercises.length}
          onStart={() => {
            setPreviewOpen(false);
            startPractice();
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}

      {historyOpen && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="history-title">
          <section className="panel-modal history-modal">
            <div className="modal-heading">
              <div><p className="eyebrow">この端末の記録</p><h2 id="history-title">練習履歴</h2></div>
              <button onClick={() => setHistoryOpen(false)} aria-label="履歴を閉じる">×</button>
            </div>
            {history.length ? (
              <>
                <div className="history-list">
                  {history.slice(0, 12).map((item) => (
                    <article key={item.id}>
                      <div><strong>{item.scene}</strong><small>{new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(item.date))}</small></div>
                      <span>{item.accuracy}<small>%</small></span>
                    </article>
                  ))}
                </div>
                <button
                  className="danger-button"
                  onClick={() => {
                    setHistory([]);
                    window.localStorage.removeItem(HISTORY_KEY);
                  }}
                >
                  この端末の履歴をすべて削除
                </button>
              </>
            ) : (
              <div className="empty-state"><span>♧</span><strong>まだ履歴はありません</strong><p>練習を終えると、正確率と誤入力の傾向が保存されます。</p></div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
