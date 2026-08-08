import type { Exercise } from "./types";

export const methodExercises: Exercise[] = [
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
    {
      id: "method-6",
      context: "引数なしのメソッド",
      description: "引数を持たないvoidメソッドを定義します。",
      input: 'static void showTitle() {\n    System.out.println("Menu");\n}',
    },
    {
      id: "method-7",
      context: "配列を受け取るメソッド",
      description: "配列の先頭要素を戻り値にします。",
      input: "static int first(int[] values) {\n    return values[0];\n}",
    },
    {
      id: "method-8",
      context: "メソッド呼び出しの入れ子",
      description: "戻り値を別のメソッド呼び出しへ渡します。",
      input: "int total = add(add(1, 2), 3);\nSystem.out.println(total);",
    },
    {
      id: "method-9",
      context: "小数の平均を返すメソッド",
      description: "double型の引数と戻り値を使います。",
      input: "static double average(double a, double b) {\n    return (a + b) / 2;\n}",
    },
    {
      id: "method-10",
      context: "大きい値を返すメソッド",
      description: "条件分岐と早いreturnを組み合わせます。",
      input: "static int max(int a, int b) {\n    if (a > b) {\n        return a;\n    }\n    return b;\n}",
    },
    {
      id: "method-11",
      context: "配列の全要素を表示するメソッド",
      description: "配列を受け取り、拡張for文で処理します。",
      input: "static void printAll(String[] values) {\n    for (String value : values) {\n        System.out.println(value);\n    }\n}",
    },
    {
      id: "method-12",
      context: "文字列の長さを返すメソッド",
      description: "String型の引数から文字数を取得して返します。",
      input: "static int lengthOf(String text) {\n    return text.length();\n}",
    },
];

