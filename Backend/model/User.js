class User {
    constructor(userId, username, passowrd, email, name, dateOfBirth, phoneNumber, registrationDate, profilePic) {
      this._userId = userId;
      this._username = username;
      this._password = passowrd;
      this._email = email;
      this._name = name;
      this._dateOfBirth = dateOfBirth;
      this._phoneNumber = phoneNumber;
      this._registrationDate = registrationDate;
      this._profilePic = profilePic;
    }
  
    get userId() {
      return this._userId;
    }
  
    set userId(userId) {
      this._userId = userId;
    }
  
    get username() {
      return this._username;
    }
  
    set username(username) {
      this._username = username;
    }
    get password() {
      return this._password;
    }
  
    set password(password) {
      this._password = password;
    }
    get email() {
      return this._email;
    }
  
    set email(email) {
      this._email = email;
    }
  
    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }
  
    get dateOfBirth() {
      return this._dateOfBirth;
    }
  
    set dateOfBirth(dateOfBirth) {
      this._dateOfBirth = dateOfBirth;
    }
  
    get phoneNumber() {
      return this._phoneNumber;
    }
  
    set phoneNumber(phoneNumber) {
      this._phoneNumber = phoneNumber;
    }
  
    get registrationDate() {
      return this._registrationDate;
    }
  
    set registrationDate(registrationDate) {
      this._registrationDate = registrationDate;
    }
    
    get profilePic() {
      return this._profilePic;
    }
  
    set profilePic(profilePic) {
      this._profilePic = profilePic;
    }
    
}

module.exports = User;