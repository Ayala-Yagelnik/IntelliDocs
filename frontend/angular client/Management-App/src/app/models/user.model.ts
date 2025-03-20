export class UserPostModel {
    constructor(
      public role: string,
      public name: string,
      public email: string,
      public password: string
    ) { }
  }
  
  export class UserLogin {
    constructor(public email: string, public password: string) { }
  }
  
  export class User {
      constructor(
      public id: number,
      public role: string,
      public name: string,
      public email: string,
      public password: string) { }
  }
  export const emptyUser = new User(0, '', '', '', '');
  