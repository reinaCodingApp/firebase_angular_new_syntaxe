import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Auth } from "@angular/fire/auth";
import { BoardTask } from "./board-tasks/models/board-tast";
import {
  Firestore,
  doc,
  docData,
  setDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  collection,
} from "@angular/fire/firestore";
import { firestoreCollections } from "app/data/firestoreCollections";
@Injectable()
export class HomeService implements Resolve<any> {
  tasks: BoardTask[] = [];
  boardStatusList: any[];

  tasks$: any;
  ownerId: any;

  constructor(private auth: Auth, private firestore: Firestore) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<void>((resovle, reject) => {
      this.ownerId = this.auth.currentUser.uid; 
      console.log("this.auth.currentUser");
      console.log(this.auth.currentUser);
      console.log("this.auth.currentUser");
      

      // this.tasks.push({
      //   id: "1",
      //   title: "title 1",
      //   detail: "detail 1",
      //   status: "toDo",
      //   owner: null,
      // } as BoardTask);
      // this.tasks.push({
      //   id: "2",
      //   title: "title 2",
      //   detail: "detail 2",
      //   status: "toDo",
      //   owner: null,
      // } as BoardTask);
      // this.tasks.push({
      //   id: "3",
      //   title: "title 3",
      //   detail: "detail 3",
      //   status: "inProgress",
      //   owner: null,
      // } as BoardTask);

      //todo : create a method in order to dispatch tasks depending on its status
      // so every this.boardStatusList.tasks will contain its own tasks
      //and this.tasks will contain all the tasks
   this.getTasksOfOwner(this.ownerId).subscribe(data=>{
    this.tasks = data;
      
      this.boardStatusList = this.getStatusList(data);
    
      });

      resovle();
    });
  }
  getTasksOfOwner(ownerId) {
    const taskDocRef = doc(
      this.firestore,
      firestoreCollections.boardTasks,
      ownerId
    );
    this.tasks$ = docData(taskDocRef, { idField: "id" });
    console.log(this.tasks$);
    return this.tasks$;
  }

  addBoardTask(task) {
    const addTask = {
      'owner': this.auth.currentUser.uid,
      'title':task.title,
      // detail: string;
      // deadline?: string;
      // creationDate: string;
      // authorId?: string;
      // labels?: string[];8
      // imageUrl?: string;
      'status': 'toDo' 
    }
    // const taskDocRef = doc(
    //   this.firestore,
    //   firestoreCollections.boardTasks,
    //   this.ownerId
    // );
    const taskDocRef = collection(this.firestore,  firestoreCollections.boardTasks); 

    return addDoc(taskDocRef,  addTask);
  }
  editBoardTask(task) {
    const taskDocRef = doc(
      this.firestore,
      firestoreCollections.boardTasks,
      this.ownerId
    );

    return updateDoc(taskDocRef, task);
  }
  deleteBoardTask() {
    const taskDocRef = doc(this.firestore, firestoreCollections.boardTasks);
    return deleteDoc(taskDocRef);
  }

  private getStatusList(tasks) {
 // temporary, you need to dispatch task on the service side
    // this.statusList[0].tasks = this.tasks.filter((t) => t.status === "toDo");
    // this.statusList[1].tasks = this.tasks.filter(
    //   (t) => t.status === "inProgress"
    // );
    // this.statusList[2].tasks = this.tasks.filter((t) => t.status === "done");
    var statusList= [];

  
    statusList = [
      { id: "toDo", label: "Nouveau", tasks: [] },
      { id: "inProgress", label: "En cours", tasks: [] },
      { id: "done", label: "Terminé", tasks: [] },
    ];
    statusList[0].tasks =  tasks.filter((t) => t.status === "toDo");
    statusList[1].tasks = tasks.filter(
        (t) => t.status === "inProgress"
      );
      statusList[2].tasks =  tasks.filter((t) => t.status === "done");
      return statusList;
  }
}
