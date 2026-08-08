import { mailExercises } from "./mail";
import { meetingExercises } from "./meeting";
import { chatExercises } from "./chat";
import { documentExercises } from "./document";
import { helloExercises } from "./hello";
import { variablesExercises } from "./variables";
import { conditionExercises } from "./condition";
import { loopExercises } from "./loop";
import { methodExercises } from "./method";
import type { Exercise, SceneId } from "./types";

export type { Exercise, SceneId } from "./types";

export const EXERCISES: Record<SceneId, Exercise[]> = {
  mail: mailExercises,
  meeting: meetingExercises,
  chat: chatExercises,
  document: documentExercises,
  hello: helloExercises,
  variables: variablesExercises,
  condition: conditionExercises,
  loop: loopExercises,
  method: methodExercises,
};

