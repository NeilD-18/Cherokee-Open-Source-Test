import { GroupId, GROUPS } from "./reducers/groupId";
import { ReviewResult } from "./reducers/leitnerBoxes";
import { Lesson } from "./reducers/lessons";
import { LessonCreationError } from "./reducers/lessons/createNewLesson";
import { UserState } from "./UserStateProvider";

export type ResizeLeitnerBoxesAction = {
  type: "RESIZE_LEITNER_BOXES";
  newNumBoxes: number;
};

export type AddSetAction = {
  type: "ADD_SET";
  setToAdd: string;
};

export type RemoveSetAction = {
  type: "REMOVE_SET";
  setToRemove: string;
};

export type SetAction = AddSetAction | RemoveSetAction;

export type SetUpstreamCollectionAction = {
  type: "SET_UPSTREAM_COLLECTION";
  newCollectionId: string | undefined;
};

export type RegisterWithGroupAction = {
  type: "REGISTER_GROUP";
  groupId: GroupId;
};

export type LoadStateAction = {
  type: "LOAD_STATE";
  state: UserState;
};

export type AddLessonAction = {
  type: "ADD_LESSON";
  lesson: Lesson;
};

export type StartLessonAction = {
  type: "START_LESSON";
  lessonId: string;
};

export type ConcludeLessonAction = {
  type: "CONCLUDE_LESSON";
  lessonId: string;
  reviewedTerms: Record<string, ReviewResult>;
};

export type FlagLessonCreationError = {
  type: "LESSON_CREATE_ERROR";
  error: LessonCreationError;
};

export type LessonsAction =
  | AddLessonAction
  | ConcludeLessonAction
  | StartLessonAction
  | FlagLessonCreationError;

export type HandleSetChangesAction = {
  type: "HANDLE_SET_CHANGES";
};

export type UserStateAction =
  | SetUpstreamCollectionAction
  | RegisterWithGroupAction
  | LoadStateAction
  | ResizeLeitnerBoxesAction
  | SetAction
  | LessonsAction
  | HandleSetChangesAction;