const db = require("../util/database");
const bcrypt = require("bcrypt");
const SALT_I = 10;
var uuid = require("uuid");

module.exports = class User {
  constructor(firstName, lastName, email, password) {
    this.id = uuid.v1();
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  save() {
    return db.query(
      "INSERT INTO users (id,firstName,lastName, email, password) VALUES (?, ?, ?, ?, ?)",
      [this.id, this.firstName, this.lastName, this.email, this.password],
      (err, rows) => {
        if (err) return false;

        return true;
      }
    );
  }

  static deleteById(id) {}

  static fetchAll() {
    return db.query("SELECT * FROM users");
  }

  static findByEmail(email) {
    return db.query(
      "SELECT * FROM users WHERE users.email = ?",
      [email],
      (err, rows) => {
        if (err) return false;
        // console.log(rows[0]);
      
        return rows[0];
        // console.log('Data received from Db:');
        // console.log(rows);
      }
    );
    // return db.execute("SELECT * FROM users WHERE users.email = ?", [email]);
  }
};
