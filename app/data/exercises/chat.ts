import type { Exercise } from "./types";

export const chatExercises: Exercise[] = [
    {
      id: "chat-1",
      context: "確認依頼への返信",
      description: "承知しました。内容を確認して折り返します。",
      input: "shouchishimashita.naiyouwokakuninshiteorikaeshimasu.",
    },
    {
      id: "chat-2",
      context: "作業完了の連絡",
      description: "更新が完了しました。ご確認をお願いします。",
      input: "koushingakanryoushimashita.gokakuninwoonegaishimasu.",
    },
    {
      id: "chat-3",
      context: "少し待ってもらう返信",
      description: "確認しますので、少々お待ちください。",
      input: "kakuninshimasunode,shoushouomachikudasai.",
    },
    {
      id: "chat-4",
      context: "相談を始めるメッセージ",
      description: "少しご相談したいことがあります。",
      input: "sukoshigosoudanshitaikotogaarimasu.",
    },
    {
      id: "chat-5",
      context: "共有への短い返信",
      description: "共有ありがとうございます。とても助かります。",
      input: "kyouyuuarigatougozaimasu.totemotasukarimasu.",
    },
    {
      id: "chat-6",
      context: "対応開始の連絡",
      description: "今から対応を始めます。",
      input: "imakarataiouwohajimemasu.",
    },
    {
      id: "chat-7",
      context: "確認結果の返信",
      description: "内容を確認しました。問題ありません。",
      input: "naiyouwokakuninshimashita.mondaiarimasenn.",
    },
    {
      id: "chat-8",
      context: "当日作業の完了報告",
      description: "本日の対応は完了しました。",
      input: "honjitsunotaiouhakanryoushimashita.",
    },
    {
      id: "chat-9",
      context: "引き継ぎの連絡",
      description: "了解です。こちらで引き継ぎます。",
      input: "ryoukaidesu.kochiradehikitsugimasu.",
    },
    {
      id: "chat-10",
      context: "急ぎでないことを伝える返信",
      description: "急ぎではないので、明日で大丈夫です。",
      input: "isogidehanainode,ashitadedaijoubudesu.",
    },
    {
      id: "chat-11",
      context: "確認後の連絡を約束",
      description: "対応方法を確認でき次第、連絡します。",
      input: "taiouhouhouwokakunindekishidai,renrakushimasu.",
    },
    {
      id: "chat-12",
      context: "ファイルを再送する連絡",
      description: "ファイル名を変更して再度送ります。",
      input: "fairumeiwohenkoushitesaidookurimasu.",
    },
    {
      id: "chat-13",
      context: "到着が遅れる連絡",
      description: "会議が長引いているため、十分ほど遅れます。",
      input: "kaigiganagabiiteirutame,juppunhodookuremasu.",
    },
    {
      id: "chat-14",
      context: "一部分だけ確認を依頼",
      description: "この部分だけ、確認をお願いできますか。",
      input: "konobubundake,kakuninwoonegaidekimasuka.",
    },
    {
      id: "chat-15",
      context: "連絡内容を訂正",
      description: "先ほどの連絡に誤りがありました。訂正します。",
      input: "sakihodonorenrakuniayamarigaarimashita.teiseishimasu.",
    },
    {
      id: "chat-16",
      context: "対応できる時間を共有",
      description: "午後三時以降であれば対応できます。",
      input: "gogosanjikoudearebataioudekimasu.",
    },
];

