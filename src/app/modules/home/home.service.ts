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
  collectionData,
  where,
  query,
  getDocs,
} from "@angular/fire/firestore";
import { firestoreCollections } from "app/data/firestoreCollections";
import moment from "moment";
@Injectable()
export class HomeService implements Resolve<any> {
  tasks: BoardTask[] = [];
  boardStatusList: any[];

  tasks$: any;
  ownerId: any;

  constructor(private auth: Auth, private firestore: Firestore) {}
    resolve (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return new Promise<void>(async (resovle, reject) => {
      this.ownerId = this.auth.currentUser.uid; 

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
      // this.tasks.push({
      //   authorId: "38WrwdZz91S8nURonHcUYEBpxbs1",
      //   creationDate: "2022-10-03T13:12:13+02:00",
      //   deadline: "2022-10-29T22:00:00.000Z",
      //   detail: "Task 3 Description",
      //   id: "4oEjUsFFpchg7o2IH23J",
      //   labels: [],
      //   owner: {
      //     email: "dev.master@hexaee.com",
      //     id: "38WrwdZz91S8nURonHcUYEBpxbs1",
      //     displayName: "DEV Master",
      //   },
      //   status: "toDo",
      //   title: "task 3",
      // } as BoardTask);

      //todo : create a method in order to dispatch tasks depending on its status
      // so every this.boardStatusList.tasks will contain its own tasks
      //and this.tasks will contain all the tasks
       await this.getTasksOfOwner(this.ownerId).then(async (data: any) => {

        await data.forEach((tsk) => {

          console.log(tsk.data());

          this.tasks.push({
            authorId: tsk.data().authorId,
            creationDate: tsk.data().creationDate,
            deadline: tsk.data().deadline,
            detail: tsk.data().detail,
            id: tsk.data().id,
            labels: tsk.data().labels,
            owner: {
              email: tsk.data().owner.email,
              id: tsk.data().owner.id,
              displayName: tsk.data().owner.displayName,
            },
            status: tsk.data().status,
            title: tsk.data().title,
          });

        });

      });

      this.boardStatusList = this.getStatusList();


      resovle();
    });
  }
  async getTasksOfOwner(ownerId) {
    // const taskDocRef = doc(
    //   this.firestore,
    //   firestoreCollections.boardTasks,
    //   ownerId
    // );
    // this.tasks$ = docData(taskDocRef, { idField: "id" });
    // console.log(this.tasks$);

    // const booksRef = collection(
    //   this.firestore,
    //   firestoreCollections.boardTasks
    // );
    // this.tasks$ = collectionData(booksRef, { idField: "id" });

    // return this.tasks$;

    const collectionRef = collection(
      this.firestore,
      firestoreCollections.boardTasks
    );

    const whereCondition = [];
    whereCondition.push(where("authorId", "==", ownerId));
    const q = query(collectionRef, ...whereCondition);

    if ((await getDocs(q)).size) {
      const data = (await getDocs(q)).docs;
      console.log(data);

      return data;
    } else {
      console.log("No data found");
      return [];
    }
  }

  addBoardTask(task) {
    const addTask = {
      owner: {
        id: this.auth.currentUser.uid,
        displayName: this.auth.currentUser.displayName,
        email: this.auth.currentUser.email,
      },
      title: task.title,
      detail: task.detail,
      deadline: task.deadline,
      creationDate: moment().format(),
      authorId: this.auth.currentUser.uid,
      labels: task.labels,
      status: "toDo",
    };

    const taskDocRef = collection(
      this.firestore,
      firestoreCollections.boardTasks
    );

    return addDoc(taskDocRef, addTask);
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

  private getStatusList() {
    console.log("cc this.tasks"); 
    console.log(this.tasks); 
    
    var     statusList = [
      { id: "toDo", label: "Nouveau", tasks: [] },
      { id: "inProgress", label: "En cours", tasks: [] },
      { id: "done", label: "Terminé", tasks: [] },
    ];
 
    statusList[0].tasks = this.tasks.filter((t) => t.status === "toDo");
    statusList[1].tasks = this.tasks.filter(
      (t) => t.status === "inProgress"
    );
    statusList[2].tasks = this.tasks.filter((t) => t.status === "done");
 
console.log("statusList");
console.log(statusList);

    return statusList;
  }
}
