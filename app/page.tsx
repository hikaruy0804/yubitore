"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Hand = "left" | "right" | "thumb";
type Finger = "pinky" | "ring" | "middle" | "index" | "thumb";
type Screen = "home" | "scenes" | "practice" | "result";
type SceneId =
  | "mail"
  | "meeting"
  | "chat"
  | "document"
  | "hello"
  | "variables"
  | "condition"
  | "loop"
  | "method";

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

type Exercise = {
  id: string;
  context: string;
  description: string;
  input: string;
};

type SessionRecord = {
  id: string;
  date: string;
  scene: string;
  accuracy: number;
  correct: number;
  mistakes: Record<string, number>;
  targetFingerErrors: Record<string, number>;
  durationSec: number;
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

const EXERCISES: Record<SceneId, Exercise[]> = {
  mail: [
    {
      id: "mail-1",
      context: "資料を受け取ったあとの確認メール",
      description: "お世話になっております。資料を確認しました。",
      input: "osewa ni natte orimasu. shiryou o kakunin shimashita.",
    },
    {
      id: "mail-2",
      context: "日程を調整するときの依頼メール",
      description: "ご都合のよい時間をお知らせください。",
      input: "gotsugou no yoi jikan o oshirase kudasai.",
    },
    {
      id: "mail-3",
      context: "対応へのお礼を伝えるメール",
      description: "早速のご対応、ありがとうございます。",
      input: "sassoku no gotaiou, arigatou gozaimasu.",
    },
    {
      id: "mail-4",
      context: "返信が遅れたときのおわび",
      description: "ご返信が遅くなり、申し訳ございません。",
      input: "gohenshin ga osoku nari, moushiwake gozaimasen.",
    },
    {
      id: "mail-5",
      context: "確認をお願いする結びのメール",
      description: "お手数ですが、ご確認のほどよろしくお願いします。",
      input: "otesuu desu ga, gokakunin no hodo yoroshiku onegai shimasu.",
    },
  ],
  meeting: [
    {
      id: "meeting-1",
      context: "次回会議の予定",
      description: "次回の会議は火曜日の午後二時からです。",
      input: "jikai no kaigi wa kayoubi no gogo niji kara desu.",
    },
    {
      id: "meeting-2",
      context: "会議で決まったこと",
      description: "新しい案を金曜日までに確認します。",
      input: "atarashii an o kinyoubi made ni kakunin shimasu.",
    },
    {
      id: "meeting-3",
      context: "担当と次の行動",
      description: "担当者が内容を整理して共有します。",
      input: "tantousha ga naiyou o seiri shite kyouyuu shimasu.",
    },
    {
      id: "meeting-4",
      context: "議題の確認",
      description: "本日の議題は、計画と予算の確認です。",
      input: "honjitsu no gidai wa, keikaku to yosan no kakunin desu.",
    },
    {
      id: "meeting-5",
      context: "保留事項の記録",
      description: "判断に必要な情報を集め、次回に持ち越します。",
      input: "handan ni hitsuyou na jouhou o atsume, jikai ni mochikoshimasu.",
    },
  ],
  chat: [
    {
      id: "chat-1",
      context: "確認依頼への返信",
      description: "承知しました。内容を確認して折り返します。",
      input: "shouchi shimashita. naiyou o kakunin shite orikaeshimasu.",
    },
    {
      id: "chat-2",
      context: "作業完了の連絡",
      description: "更新が完了しました。ご確認をお願いします。",
      input: "koushin ga kanryou shimashita. gokakunin o onegai shimasu.",
    },
    {
      id: "chat-3",
      context: "少し待ってもらう返信",
      description: "確認しますので、少々お待ちください。",
      input: "kakunin shimasu node, shoushou omachi kudasai.",
    },
    {
      id: "chat-4",
      context: "相談を始めるメッセージ",
      description: "少しご相談したいことがあります。",
      input: "sukoshi gosoudan shitai koto ga arimasu.",
    },
    {
      id: "chat-5",
      context: "共有への短い返信",
      description: "共有ありがとうございます。とても助かります。",
      input: "kyouyuu arigatou gozaimasu. totemo tasukarimasu.",
    },
  ],
  document: [
    {
      id: "document-1",
      context: "提案書の導入",
      description: "新しい提案について、要点を三つに整理します。",
      input: "atarashii teian ni tsuite, youten o mittsu ni seiri shimasu.",
    },
    {
      id: "document-2",
      context: "状況報告の本文",
      description: "現在の進捗と今後の予定を共有します。",
      input: "genzai no shinchoku to kongo no yotei o kyouyuu shimasu.",
    },
    {
      id: "document-3",
      context: "手順書の説明",
      description: "はじめに設定画面を開き、必要な項目を選びます。",
      input: "hajime ni settei gamen o hiraki, hitsuyou na koumoku o erabimasu.",
    },
    {
      id: "document-4",
      context: "改善案のまとめ",
      description: "課題を整理し、実行しやすい改善策を提案します。",
      input: "kadai o seiri shi, jikkou shiyasui kaizensaku o teian shimasu.",
    },
    {
      id: "document-5",
      context: "報告書の結論",
      description: "以上の結果から、次の方針を決定しました。",
      input: "ijou no kekka kara, tsugi no houshin o kettei shimashita.",
    },
  ],
  hello: [
    {
      id: "hello-1",
      context: "Hello, Java!",
      description: "クラス、mainメソッド、標準出力をまとめて写経します。",
      input: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}',
    },
    {
      id: "hello-2",
      context: "2行の標準出力",
      description: "同じメソッドを続けて呼び、改行とインデントを練習します。",
      input: 'public class Greeting {\n    public static void main(String[] args) {\n        System.out.println("Good morning");\n        System.out.println("Welcome to Java");\n    }\n}',
    },
    {
      id: "hello-3",
      context: "文字列の連結",
      description: "ダブルクォート、プラス、数字を含む出力です。",
      input: 'public class Profile {\n    public static void main(String[] args) {\n        System.out.println("Level: " + 3);\n    }\n}',
    },
    {
      id: "hello-4",
      context: "引数の表示",
      description: "配列の最初の値を読み、画面へ表示します。",
      input: 'public class Argument {\n    public static void main(String[] args) {\n        System.out.println(args[0]);\n    }\n}',
    },
    {
      id: "hello-5",
      context: "計算結果の表示",
      description: "計算式をprintlnの引数へ直接記述します。",
      input: 'public class Calculator {\n    public static void main(String[] args) {\n        System.out.println(12 + 8);\n    }\n}',
    },
  ],
  variables: [
    {
      id: "variables-1",
      context: "整数と文字列",
      description: "型、変数名、代入、セミコロンを練習します。",
      input: 'int count = 3;\nString message = "Hello";\nSystem.out.println(message + count);',
    },
    {
      id: "variables-2",
      context: "小数の計算",
      description: "double型と小数点、掛け算を含むコードです。",
      input: "double price = 120.5;\nint amount = 2;\ndouble total = price * amount;",
    },
    {
      id: "variables-3",
      context: "boolean型",
      description: "比較結果を真偽値として変数へ代入します。",
      input: "int score = 82;\nboolean passed = score >= 80;",
    },
    {
      id: "variables-4",
      context: "文字と真偽値",
      description: "char型とboolean型の宣言を続けて入力します。",
      input: "char grade = 'A';\nboolean active = true;",
    },
    {
      id: "variables-5",
      context: "配列の初期化",
      description: "角括弧と波括弧を含む配列宣言です。",
      input: "int[] scores = {78, 85, 92};\nint first = scores[0];",
    },
  ],
  condition: [
    {
      id: "condition-1",
      context: "合格判定",
      description: "比較演算子、if、else、波括弧をまとめて練習します。",
      input: 'if (score >= 80) {\n    System.out.println("Pass");\n} else {\n    System.out.println("Try again");\n}',
    },
    {
      id: "condition-2",
      context: "偶数の判定",
      description: "剰余演算子と等価演算子を使います。",
      input: 'if (number % 2 == 0) {\n    System.out.println("Even");\n}',
    },
    {
      id: "condition-3",
      context: "範囲の確認",
      description: "AND演算子を使い、複数の条件を組み合わせます。",
      input: 'if (age >= 18 && age < 65) {\n    System.out.println("Adult");\n}',
    },
    {
      id: "condition-4",
      context: "否定条件",
      description: "感嘆符を使い、falseのときだけ処理します。",
      input: 'if (!finished) {\n    System.out.println("Working");\n}',
    },
    {
      id: "condition-5",
      context: "三段階の判定",
      description: "else ifを使って条件を順番に評価します。",
      input: 'if (score >= 90) {\n    grade = "A";\n} else if (score >= 80) {\n    grade = "B";\n} else {\n    grade = "C";\n}',
    },
  ],
  loop: [
    {
      id: "loop-1",
      context: "forループ",
      description: "初期化、条件、インクリメントを一行で入力します。",
      input: "for (int i = 0; i < 5; i++) {\n    System.out.println(i);\n}",
    },
    {
      id: "loop-2",
      context: "拡張forループ",
      description: "配列、コロン、拡張for文を写経します。",
      input: 'String[] names = {"Aki", "Haru", "Sora"};\nfor (String name : names) {\n    System.out.println(name);\n}',
    },
    {
      id: "loop-3",
      context: "whileループ",
      description: "条件式とインクリメントを別の行に書きます。",
      input: "int count = 0;\nwhile (count < 3) {\n    count++;\n}",
    },
    {
      id: "loop-4",
      context: "逆順のforループ",
      description: "デクリメントを使って数字を減らします。",
      input: "for (int i = 5; i > 0; i--) {\n    System.out.println(i);\n}",
    },
    {
      id: "loop-5",
      context: "二重ループ",
      description: "入れ子になったfor文と掛け算を練習します。",
      input: "for (int row = 1; row <= 3; row++) {\n    for (int col = 1; col <= 3; col++) {\n        System.out.println(row * col);\n    }\n}",
    },
  ],
  method: [
    {
      id: "method-1",
      context: "値を返すメソッド",
      description: "引数、戻り値、return文を練習します。",
      input: "static int add(int a, int b) {\n    return a + b;\n}",
    },
    {
      id: "method-2",
      context: "voidメソッド",
      description: "文字列を受け取り、標準出力するメソッドです。",
      input: "static void greet(String name) {\n    System.out.println(\"Hello, \" + name);\n}",
    },
    {
      id: "method-3",
      context: "メソッド呼び出し",
      description: "戻り値を変数へ受け取り、出力します。",
      input: "int result = add(12, 8);\nSystem.out.println(result);",
    },
    {
      id: "method-4",
      context: "真偽値を返すメソッド",
      description: "比較結果をreturn文でそのまま返します。",
      input: "static boolean isAdult(int age) {\n    return age >= 18;\n}",
    },
    {
      id: "method-5",
      context: "文字列を返すメソッド",
      description: "String型の戻り値と文字列連結を練習します。",
      input: 'static String label(String name) {\n    return "Hello, " + name;\n}',
    },
  ],
};

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
    <button className="brand" onClick={onClick} aria-label="ゆびトレのトップへ">
      <span>ゆびトレ</span>
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

function SettingsPanel({
  settings,
  onChange,
  onClose,
}: {
  settings: Settings;
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
            value={settings.exerciseCount}
            onChange={(event) => onChange({ ...settings, exerciseCount: Number(event.target.value) })}
          >
            <option value={1}>1題・短め</option>
            <option value={2}>2題・軽め</option>
            <option value={3}>3題・標準</option>
            <option value={4}>4題・しっかり</option>
            <option value={5}>5題・全問</option>
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

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [scene, setScene] = useState<SceneId>("mail");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [history, setHistory] = useState<SessionRecord[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState<Record<string, number>>({});
  const [targetFingerErrors, setTargetFingerErrors] = useState<Record<string, number>>({});
  const [wrongKey, setWrongKey] = useState<string | null>(null);
  const [status, setStatus] = useState("入力を続けられます");
  const [paused, setPaused] = useState(false);
  const [sessionStart, setSessionStart] = useState(0);
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

  const exercises = useMemo<Exercise[]>(() => {
    return EXERCISES[scene].slice(0, settings.exerciseCount);
  }, [scene, settings.exerciseCount]);

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
        mistakes: finalMistakes,
        targetFingerErrors: finalFingerErrors,
        durationSec: Math.max(1, Math.round((Date.now() - sessionStart) / 1000)),
      };
      setResult(record);
      setHistory((items) => [record, ...items].slice(0, 40));
      setScreen("result");
    },
    [scene, sessionStart],
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
        setStatus(isJavaScene(scene) ? "次のスニペットへ進みました" : "次の文章へ進みました");
        return;
      }
      finishSession(nextCorrect, nextMistakes, nextFingerErrors);
    },
    [charIndex, exercise.input.length, exerciseIndex, exercises.length, finishSession, scene],
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
        setStatus("入力を続けられます");
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
      setStatus(`${displayKey(target)} は ${targetInfo.label}（${targetInfo.zone}）`);
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
    targetInfo.zone,
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
    setStatus(
      isJavaScene(scene)
        ? "Javaコードを見ながら、そのまま入力してください"
        : "文章を見ながら、そのまま入力してください",
    );
    setPaused(false);
    setResult(null);
    setSessionStart(Date.now());
    setScreen("practice");
  };

  const goHome = () => {
    setPaused(false);
    setScreen("home");
  };

  const style = { "--font-scale": settings.fontScale } as React.CSSProperties;

  return (
    <main
      className={`${settings.animation ? "" : "no-animation"} ${settings.largeGuide ? "large-guide" : "compact-guide"} ${screen === "practice" ? "practice-mode" : ""}`}
      style={style}
    >
      <div className="desktop-note">
        物理キーボードを接続したPCでご利用ください。
      </div>

      <header className="site-header">
        <Brand onClick={goHome} />
        <nav aria-label="メインメニュー">
          <button onClick={() => setHistoryOpen(true)}>練習履歴</button>
          <button onClick={() => setSettingsOpen(true)}>設定</button>
        </nav>
      </header>

      {screen === "home" && (
        <div className="page-shell">
          <section className="hero" aria-label="練習を開始">
            <div className="home-start">
              <button className="primary-button hero-button" onClick={() => setScreen("scenes")}>
                練習を始める <span>→</span>
              </button>
              <small className="hero-safety">痛みやしびれがある場合は、手を休めてください。</small>
            </div>
          </section>
        </div>
      )}

      {screen === "scenes" && (
        <div className="page-shell inner-page">
          <button className="back-link" onClick={goHome}>← トップへ戻る</button>
          <div className="page-title">
            <p className="eyebrow">練習メニュー</p>
            <h1>練習を選ぶ</h1>
          </div>

          <section className="scene-start-bar" aria-label="選択中の練習">
            <div>
              <span className="section-label">選択中</span>
              <strong>{SCENES[scene].title}</strong>
              <small>{exercises[0].context}・{settings.exerciseCount}{isJavaScene(scene) ? "本" : "文"}</small>
            </div>
            <div className="scene-start-actions">
              <button className="primary-button" onClick={startPractice}>
                {SCENES[scene].title}を始める →
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
              <div><span>02</span><h2>Java編</h2><b>NEW</b></div>
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
                    <pre>{exercise.input}</pre>
                  </>
                ) : (
                  <>
                    <p>{exercise.context}</p>
                    <strong>{exercise.description}</strong>
                  </>
                )}
              </div>

              <div className="next-input" aria-label={`次に入力する文字 ${displayKey(target)}`}>
                <span>次に入力</span>
                <strong className={displayKey(target).length > 2 ? "word-key" : ""}>{displayKey(target)}</strong>
              </div>

              <div className={`quiet-feedback ${wrongKey ? "error" : ""}`} role="status" aria-live="polite">
                <span aria-hidden="true">{wrongKey ? "×" : "●"}</span>
                {status}
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
                  <span>{isJavaScene(scene) ? "入力位置" : "ローマ字の入力位置"}</span>
                  <small>入力済みは薄く、次の1文字だけを強調</small>
                </div>
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
                <button className="text-button" onClick={goHome}>練習を終了</button>
              </section>
            </div>
          )}
        </div>
      )}

      {screen === "result" && result && (
        <div className="page-shell result-page">
          <div className="result-title">
            <p className="eyebrow">{isJavaScene(scene) ? "Javaコードの写経が終わりました" : "文章の入力が終わりました"}</p>
            <h1>{isJavaScene(scene) ? "構造を追いながら、最後まで入力できました。" : "流れを保ったまま、最後まで入力できました。"}</h1>
            <p>
              {isJavaScene(scene)
                ? "速度は評価しません。英字・記号・Shift操作のうち、間違いが集中した箇所を見直します。"
                : "速度は評価しません。間違いが集中したキーと、その担当指を見直します。"}
            </p>
          </div>

          <section className="result-stats">
            <article><span>正確率</span><strong>{result.accuracy}<small>%</small></strong><p>{result.correct}文字を入力</p></article>
            <article><span>誤入力</span><strong>{Object.values(result.mistakes).reduce((a, b) => a + b, 0)}<small>回</small></strong><p>正しいキーを押すまで進みません</p></article>
            <article><span>練習時間</span><strong>{Math.max(1, Math.ceil(result.durationSec / 60))}<small>分</small></strong><p>速度の評価には使用しません</p></article>
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
            <button className="primary-button" onClick={startPractice}>{isJavaScene(scene) ? "同じ構文をもう一度" : "同じ文章をもう一度"}</button>
            <button className="secondary-button" onClick={() => setScreen("scenes")}>別の練習を選ぶ</button>
            <button className="text-button" onClick={goHome}>トップへ戻る</button>
          </div>
          <aside className="safety-note">手をキーボードから離し、指と肩を休ませましょう。</aside>
        </div>
      )}

      {settingsOpen && (
        <SettingsPanel settings={settings} onChange={setSettings} onClose={() => setSettingsOpen(false)} />
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
              <div className="empty-state"><span>♧</span><strong>まだ履歴はありません</strong><p>Java写経を終えると、正確率と誤入力の傾向が保存されます。</p></div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
