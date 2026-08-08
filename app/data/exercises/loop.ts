import type { Exercise } from "./types";

export const loopExercises: Exercise[] = [
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
    {
      id: "loop-6",
      context: "do-whileループ",
      description: "処理後に条件を判定するループです。",
      input: "int count = 3;\ndo {\n    count--;\n} while (count > 0);",
    },
    {
      id: "loop-7",
      context: "continueによるスキップ",
      description: "条件に合う回だけ処理を飛ばします。",
      input: "for (int i = 0; i < 6; i++) {\n    if (i % 2 == 0) {\n        continue;\n    }\n    System.out.println(i);\n}",
    },
    {
      id: "loop-8",
      context: "breakによる終了",
      description: "条件に達した時点でループを終了します。",
      input: "for (int i = 0; i < 10; i++) {\n    if (i == 4) {\n        break;\n    }\n}",
    },
    {
      id: "loop-9",
      context: "合計値の計算",
      description: "ループ内で値を足し、合計を更新します。",
      input: "int sum = 0;\nfor (int i = 1; i <= 5; i++) {\n    sum += i;\n}",
    },
    {
      id: "loop-10",
      context: "文字列を一文字ずつ表示",
      description: "文字列の長さを使って繰り返します。",
      input: "for (int i = 0; i < text.length(); i++) {\n    System.out.println(text.charAt(i));\n}",
    },
    {
      id: "loop-11",
      context: "whileループからの脱出",
      description: "条件を満たしたらbreakで処理を終えます。",
      input: "int value = 1;\nwhile (value < 100) {\n    value *= 2;\n    if (value > 50) {\n        break;\n    }\n}",
    },
    {
      id: "loop-12",
      context: "配列を添字で走査",
      description: "配列の長さを使って全要素を表示します。",
      input: "for (int i = 0; i < scores.length; i++) {\n    System.out.println(scores[i]);\n}",
    },
];

