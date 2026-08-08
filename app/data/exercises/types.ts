export type SceneId =
  | "mail"
  | "meeting"
  | "chat"
  | "document"
  | "hello"
  | "variables"
  | "condition"
  | "loop"
  | "method";

export type Exercise = {
  id: string;
  context: string;
  description: string;
  input: string;
};

