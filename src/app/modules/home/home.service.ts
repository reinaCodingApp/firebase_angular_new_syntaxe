import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { BoardTask } from "./board-tasks/models/board-tast";

@Injectable()
export class HomeService implements Resolve<any> {
  tasks: BoardTask[] = [];
  boardStatusList: any[]
  constructor(private auth: Auth) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<void>((resovle, reject) => {
      this.boardStatusList = this.getStatusList();
      this.tasks.push({
        id: "1",
        title: "title 1",
        detail: "detail 1",
        status: "toDo",
        owner: null,
      } as BoardTask);
      this.tasks.push({
        id: "2",
        title: "title 2",
        detail: "detail 2",
        status: "toDo",
        owner: null,
      } as BoardTask);
      this.tasks.push({
        id: "3",
        title: "title 3",
        detail: "detail 3",
        status: "inProgress",
        owner: null,
      } as BoardTask);

      //todo : create a method in order to dispatch tasks depending on its status 
      // so every this.boardStatusList.tasks will contain its own tasks
      //and this.tasks will contain all the tasks
      resovle();
    });
  }
  get(ownerId) {}
  addBoardTask() {}
  editBoardTask() {}
  deleteBoardTask() {}

  private getStatusList() {
    return [{id: 'toDo', label: 'Nouveau', tasks: []}, 
            {id: 'inProgress', label: 'En cours', tasks: []},
            {id: 'done', label: 'Terminé', tasks: []}]
  }
}
