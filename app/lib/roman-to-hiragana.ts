const PUNCTUATION: Record<string, string> = {
  ".": "。",
  ",": "、",
  "!": "！",
  "?": "？",
  "-": "ー",
  " ": "　",
  "\n": "\n",
};

const SYLLABLES: Record<string, string> = {
  kya: "きゃ", kyu: "きゅ", kyo: "きょ",
  gya: "ぎゃ", gyu: "ぎゅ", gyo: "ぎょ",
  sha: "しゃ", shu: "しゅ", sho: "しょ", she: "しぇ",
  sya: "しゃ", syu: "しゅ", syo: "しょ",
  ja: "じゃ", ju: "じゅ", jo: "じょ", je: "じぇ",
  jya: "じゃ", jyu: "じゅ", jyo: "じょ",
  cha: "ちゃ", chu: "ちゅ", cho: "ちょ", che: "ちぇ",
  cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ",
  tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ",
  nya: "にゃ", nyu: "にゅ", nyo: "にょ",
  hya: "ひゃ", hyu: "ひゅ", hyo: "ひょ",
  bya: "びゃ", byu: "びゅ", byo: "びょ",
  pya: "ぴゃ", pyu: "ぴゅ", pyo: "ぴょ",
  mya: "みゃ", myu: "みゅ", myo: "みょ",
  rya: "りゃ", ryu: "りゅ", ryo: "りょ",
  dya: "ぢゃ", dyu: "ぢゅ", dyo: "ぢょ",
  fa: "ふぁ", fi: "ふぃ", fe: "ふぇ", fo: "ふぉ",
  va: "ゔぁ", vi: "ゔぃ", vu: "ゔ", ve: "ゔぇ", vo: "ゔぉ",
  tsa: "つぁ", tsi: "つぃ", tse: "つぇ", tso: "つぉ",
  thi: "てぃ", thu: "てゅ", dhi: "でぃ", dhu: "でゅ",
  wi: "うぃ", we: "うぇ", who: "うぉ",
  xtu: "っ", ltu: "っ", xtsu: "っ", ltsu: "っ",
  xa: "ぁ", xi: "ぃ", xu: "ぅ", xe: "ぇ", xo: "ぉ",
  la: "ぁ", li: "ぃ", lu: "ぅ", le: "ぇ", lo: "ぉ",
  xya: "ゃ", xyu: "ゅ", xyo: "ょ",
  lya: "ゃ", lyu: "ゅ", lyo: "ょ",
  a: "あ", i: "い", u: "う", e: "え", o: "お",
  ka: "か", ki: "き", ku: "く", ke: "け", ko: "こ",
  ga: "が", gi: "ぎ", gu: "ぐ", ge: "げ", go: "ご",
  sa: "さ", shi: "し", si: "し", su: "す", se: "せ", so: "そ",
  za: "ざ", ji: "じ", zi: "じ", zu: "ず", ze: "ぜ", zo: "ぞ",
  ta: "た", chi: "ち", ti: "ち", tsu: "つ", tu: "つ", te: "て", to: "と",
  da: "だ", di: "ぢ", du: "づ", de: "で", do: "ど",
  na: "な", ni: "に", nu: "ぬ", ne: "ね", no: "の",
  ha: "は", hi: "ひ", fu: "ふ", hu: "ふ", he: "へ", ho: "ほ",
  ba: "ば", bi: "び", bu: "ぶ", be: "べ", bo: "ぼ",
  pa: "ぱ", pi: "ぴ", pu: "ぷ", pe: "ぺ", po: "ぽ",
  ma: "ま", mi: "み", mu: "む", me: "め", mo: "も",
  ya: "や", yu: "ゆ", yo: "よ",
  ra: "ら", ri: "り", ru: "る", re: "れ", ro: "ろ",
  wa: "わ", wo: "を",
};

const VOWEL_OR_Y = /^[aiueoy]$/;
const CONSONANT = /^[bcdfghjklmpqrstvwxyz]$/;

export function romanToHiragana(input: string, complete = false) {
  const source = input.toLowerCase();
  let result = "";
  let index = 0;

  while (index < source.length) {
    const current = source[index];
    const punctuation = PUNCTUATION[current];
    if (punctuation) {
      result += punctuation;
      index += 1;
      continue;
    }

    const next = source[index + 1];
    if (current === "n") {
      const afterNext = source[index + 2];
      if (next === "n") {
        result += "ん";
        index += afterNext && VOWEL_OR_Y.test(afterNext) ? 1 : 2;
        continue;
      }
      if (!next) {
        if (complete) result += "ん";
        break;
      }
      if (!VOWEL_OR_Y.test(next)) {
        result += "ん";
        index += 1;
        continue;
      }
    }

    if (current === next && CONSONANT.test(current) && current !== "n") {
      result += "っ";
      index += 1;
      continue;
    }

    let matched = false;
    for (let length = Math.min(4, source.length - index); length > 0; length -= 1) {
      const kana = SYLLABLES[source.slice(index, index + length)];
      if (!kana) continue;
      result += kana;
      index += length;
      matched = true;
      break;
    }
    if (matched) continue;

    // 未確定の子音は、次のキーで音節が完成するまで表示しない。
    index += 1;
  }

  return result;
}
