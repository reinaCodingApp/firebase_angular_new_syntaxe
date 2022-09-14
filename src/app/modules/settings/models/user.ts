export class User {
    uid: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;
    phoneNumber: string;
    photoURL: string;
    customClaims?: any;
    constructor(email?: string, password?: string, uid?: string){
        this.email = email;
        this.password = password;
        this.uid = uid;
    }
}
