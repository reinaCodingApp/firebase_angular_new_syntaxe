export class User {

  constructor(email?: string, password?: string, name?: string, uid?: string) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.uid = uid;
  }
  uid: string;
  email: string;
  password: string;
  name: string;
}
