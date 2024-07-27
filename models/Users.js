const dbpool = require('../database');
const bcrypt = require('bcryptjs');

class User {
  constructor({ username, password, email, disabled }) {
    this.username = username;
    this.password = password;
    this.email = email;
    this.disabled = disabled;
  }

  static async getAllUsers() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }
        connection.query('SELECT u.*, GROUP_CONCAT(ug.groupname) AS groupnames FROM user u LEFT JOIN usergroup ug ON u.username = ug.username GROUP BY u.username', (err, results) => {
          connection.release();
          if (err) {
            console.error('Error executing query:', err);
            return reject(err);
          }
          results.forEach(user => {
            if (user.groupnames) {
              user.groupnames = user.groupnames.split(',');
            } else {
              user.groupnames = []; // Handle case where user has no groups
            }
          });
          return resolve(results);
        });
      });
    });
  }

  async save() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection(async (err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }

        const { username, email, password, disabled } = this;
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO user (username, email, password, disabled) VALUES (?, ?, ?, ?)';
        const values = [username.toLowerCase(), email, hashedPassword, disabled];

        connection.query(sql, values, (err, results) => {
          connection.release();

          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return reject('Duplicate username, username already exists in db');
            }
            console.error('Error executing query:', err);
            return reject(err);
          }
          return resolve(results); 
        });
      });
    });
  }


  async getByUsername() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }
        const { username } = this;
        const sql = `SELECT u.*, GROUP_CONCAT(ug.groupname) AS groupnames FROM user u LEFT JOIN usergroup ug ON u.username = ug.username WHERE u.username = ? GROUP BY u.username`;
        const values = [username];
        console.log(username);

        connection.query(sql, values, (err, results) => {
          connection.release();
          if (err) {
            console.error('Error executing query:', err);
            return reject(err);
          }
          console.log(results)
          if (results.length > 0) {
            return resolve(results[0]);
          } else {
            return reject("User not found");
          }
        });
      });
    });
  }



  async updateEmail() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }
        const { username, email } = this;
        const sql = 'UPDATE user SET email = ? WHERE username = ?';
        const values = [email, username.toLowerCase()];

        connection.query(sql, values, (err, result) => {
          connection.release();
          if (err) {
            console.error('Error updating email:', err);
            return reject(err);
          }
          return resolve(result.affectedRows);
        });
      });
    });
  }

  async updatePassword() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection(async (err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }

        try {
          const { username, password } = this;
          console.log('updatePassword username password');
          console.log(username, password);

          let sql = 'UPDATE user SET ';
          const values = [];
          
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            sql += 'password = ? WHERE username = ?';
            values.push(hashedPassword, username.toLowerCase());
          } else {
            sql += 'username = ? WHERE username = ?';
            values.push(username.toLowerCase(), username.toLowerCase());
          }

          connection.query(sql, values, (err, result) => {
            connection.release();
            if (err) {
              console.error('Error updating password:', err);
              return reject(err);
            }
            console.log(result);
            return resolve(result.affectedRows);
          });
        } catch (error) {
          connection.release();
          return reject(error);
        }
      });
    });
  }

  async adminUpdateUser() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection(async (err, connection) => {
        if (err) {
          console.error('Error getting database connection:', err);
          return reject(err);
        }

        try {
          let sql = 'UPDATE user SET email=?, disabled=?';
          const values = [this.email, this.disabled];

          if (this.password) {
            // If password is provided, hash it and include it in the SQL statement
            const hashedPassword = await bcrypt.hash(this.password, 10);
            sql += ', password=?';
            values.push(hashedPassword);
          }

          sql += ' WHERE username=?';
          values.push(this.username);

          connection.query(sql, values, (err, results) => {
            connection.release();
            if (err) {
              console.error('Error executing query:', err);
              return reject(err);
            }
            console.log('User updated successfully:', results);
            return resolve(results);
          });
        } catch (error) {
          connection.release();
          return reject(error);
        }
      });
    });
  }
  
}

module.exports = User;
