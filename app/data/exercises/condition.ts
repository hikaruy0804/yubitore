import type { Exercise } from "./types";

export const conditionExercises: Exercise[] = [
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
    {
      id: "condition-6",
      context: "文字列の一致判定",
      description: "equalsメソッドを条件式で使用します。",
      input: 'if (name.equals("Aki")) {\n    System.out.println("Hello");\n}',
    },
    {
      id: "condition-7",
      context: "三項演算子",
      description: "条件に応じて文字列を選択します。",
      input: 'String result = score >= 60 ? "Pass" : "Fail";',
    },
    {
      id: "condition-8",
      context: "入れ子の条件分岐",
      description: "if文の中でもう一つの条件を確認します。",
      input: 'if (loggedIn) {\n    if (admin) {\n        System.out.println("Admin");\n    }\n}',
    },
    {
      id: "condition-9",
      context: "不一致の判定",
      description: "等しくないことを比較演算子で確認します。",
      input: 'if (status != 200) {\n    System.out.println("Error");\n}',
    },
    {
      id: "condition-10",
      context: "気温による表示の切り替え",
      description: "ifとelseで二つのメッセージを切り替えます。",
      input: 'if (temperature < 10) {\n    System.out.println("Cold");\n} else {\n    System.out.println("Warm");\n}',
    },
    {
      id: "condition-11",
      context: "空でない文字列の確認",
      description: "文字列の長さを条件式で確認します。",
      input: 'if (name.length() > 0) {\n    System.out.println(name);\n}',
    },
    {
      id: "condition-12",
      context: "在庫有無の三項演算",
      description: "比較結果からboolean値を選択します。",
      input: "boolean available = stock > 0 ? true : false;",
    },
];

