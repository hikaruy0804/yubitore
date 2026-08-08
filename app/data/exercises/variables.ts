import type { Exercise } from "./types";

export const variablesExercises: Exercise[] = [
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
    {
      id: "variables-6",
      context: "long型とfloat型",
      description: "整数と小数の別の型を宣言します。",
      input: "long distance = 1200;\nfloat rate = 1.5f;",
    },
    {
      id: "variables-7",
      context: "文字列変数の連結",
      description: "複数の文字列変数を一つにまとめます。",
      input: 'String firstName = "Aki";\nString lastName = "Sato";\nString fullName = firstName + lastName;',
    },
    {
      id: "variables-8",
      context: "変数の再代入",
      description: "値のコピーと再代入を続けて入力します。",
      input: "int x = 10;\nint y = x;\nx = 20;",
    },
    {
      id: "variables-9",
      context: "定数の宣言",
      description: "finalを使い、変更しない整数を宣言します。",
      input: "final int LIMIT = 50;",
    },
    {
      id: "variables-10",
      context: "複数変数の宣言",
      description: "同じ型の変数を一行で宣言し、面積を計算します。",
      input: "int width = 8, height = 5;\nint area = width * height;",
    },
    {
      id: "variables-11",
      context: "型のキャスト",
      description: "小数を整数へ明示的に変換します。",
      input: "double price = 98.7;\nint rounded = (int) price;",
    },
    {
      id: "variables-12",
      context: "nullの代入と比較",
      description: "参照型の初期値をnullにして比較します。",
      input: "String note = null;\nboolean empty = note == null;",
    },
];

