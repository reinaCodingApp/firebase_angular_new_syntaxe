export class BoardTask {
    id: string;
    owner: {id: string; firstName: string; lastName: string; email?: string};
    title: string;
    detail: string;
    deadline?: string;
    creationDate: string;
    authorId?: string;
    labels?: string[];
    imageUrl?: string;
    status: 'toDo' | 'inProgress' | 'done';
}
    