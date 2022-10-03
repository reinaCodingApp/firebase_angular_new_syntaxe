import { Label } from "./Label";

export class BoardTask {
  id: string;
  owner: { id: string; displayName: string; email?: string };
  title: string;
  detail: string;
  deadline?: string;
  creationDate: string;
  authorId?: string;
  labels?: Label[];
  imageUrl?: string;
  status: "toDo" | "inProgress" | "done";
}
