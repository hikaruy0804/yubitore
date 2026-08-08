import type { Exercise } from "./types";

export const helloExercises: Exercise[] = [
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
    {
      id: "hello-6",
      context: "変数を含むあいさつ",
      description: "文字列変数を標準出力へ連結します。",
      input: 'public class Welcome {\n    public static void main(String[] args) {\n        String name = "Aki";\n        System.out.println("Welcome, " + name);\n    }\n}',
    },
    {
      id: "hello-7",
      context: "真偽値の標準出力",
      description: "boolean値をprintlnで表示します。",
      input: "public class Status {\n    public static void main(String[] args) {\n        System.out.println(true);\n    }\n}",
    },
    {
      id: "hello-8",
      context: "複数の計算を表示",
      description: "掛け算と足し算を含む式を出力します。",
      input: "public class Formula {\n    public static void main(String[] args) {\n        System.out.println(4 * 5 + 2);\n    }\n}",
    },
    {
      id: "hello-9",
      context: "引数の個数を表示",
      description: "mainメソッドが受け取った引数の個数を表示します。",
      input: "public class CountArgs {\n    public static void main(String[] args) {\n        System.out.println(args.length);\n    }\n}",
    },
    {
      id: "hello-10",
      context: "名前を変数に保存して表示",
      description: "mainメソッド内で文字列変数を宣言して出力します。",
      input: 'public class UserName {\n    public static void main(String[] args) {\n        String user = "Aoi";\n        System.out.println(user);\n    }\n}',
    },
    {
      id: "hello-11",
      context: "改行しない出力",
      description: "printとprintlnを続けて呼び出します。",
      input: 'public class Inline {\n    public static void main(String[] args) {\n        System.out.print("Loading");\n        System.out.println(" done");\n    }\n}',
    },
    {
      id: "hello-12",
      context: "平均値の計算と表示",
      description: "変数へ計算結果を保存し、割り算した値を表示します。",
      input: "public class Average {\n    public static void main(String[] args) {\n        int total = 24 + 18;\n        System.out.println(total / 2);\n    }\n}",
    },
];

