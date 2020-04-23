export class User {
    constructor(email?: string, password?: string, uid?: string){
        this.email = email;
        this.password = password;
        this.uid = uid;
    }
    uid: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    photoURL: string;
    customClaims?: any;
}
