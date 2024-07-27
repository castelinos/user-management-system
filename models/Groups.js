const dbpool = require('../database');

class Group {
  constructor({ groupname, username }) {
    this.groupname = groupname;
    this.username = username
  }

  static async getAllGroups() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }
        connection.query(`SELECT DISTINCT groupname FROM usergroup WHERE groupname IS NOT NULL AND groupname != ''`, (err, results) => {
          connection.release();
          if (err) {
            console.error('Error executing query:', err);
            return reject(err);
          }
          return resolve(results);
        });
      });
    });
  }

  async save() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          return reject(err);
        }
        const { groupname } = this;
        const sql = 'INSERT INTO usergroup (groupname) VALUES (?)';
        const values = [groupname.toLowerCase()];

        connection.query(sql, values, (err, results) => {
          connection.release();
          console.log('result save')
          console.log(results)
          if (err) {
           return reject(err);
          }
          return resolve(results.affectedRows);
        });
      });
    });
  }

  async getGroupByUsername() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.error('Error connecting to database:', err);
          return reject(err);
        }
        const { username } = this;
        const sql = `SELECT * from usergroup where username = ?`;
        const values = [username];
        console.log('username group.js')
        console.log(username);

        connection.query(sql, values, (err, results) => {
          connection.release();
          if (err) {
            console.error('Error executing query:', err);
            return reject(err);
          }
          console.log(results)
          return resolve(results);
        });
      });
    });
  }

  async updateUserGroup() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        if (err) {
          console.log(err)
          return reject('Database connection failed');
        }
        const { groupname, username } = this;
        const selectSql = 'SELECT COUNT(*) AS count FROM usergroup WHERE groupname = ? AND username = ?';
        const selectValues = [groupname.toLowerCase(), username.toLowerCase()];

        connection.query(selectSql, selectValues, (err, results) => {
          console.log('results err')
          console.log(results)
          console.log(err)
          if (err) {
            connection.release();
            return reject(err);
          }

          // if row already exist, return
          const count = results[0].count;
          if (count > 0) {
            connection.release();
            return resolve();
          }
          const insertSql = 'INSERT INTO usergroup (groupname, username) VALUES (?, ?)';
          const insertValues = [groupname.toLowerCase(), username.toLowerCase()];

          connection.query(insertSql, insertValues, (err, results) => {
            connection.release();
            if (err) {
              return reject(err);
            }
            return resolve(results);
          });
        });
      });
    });
  }

  async removeUserGroup() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        const { groupname, username } = this;
        console.log('this')
        console.log(this)
        console.log(groupname, username)
        const sql = `delete from usergroup where groupname=? and username=? ;`;
        const values = [groupname.toLowerCase(), username.toLowerCase()];

        connection.query(sql, values, (err, results) => {
          if (err) {
            connection.release();
            return reject(err);
          }
          console.log(results);
          return resolve(results)          
        });
      })
    })
  }

  async checkGroup() {
    return new Promise((resolve, reject) => {
      dbpool.getConnection((err, connection) => {
        const { groupname, username } = this;
        console.log('check group model')
        console.log(this)
        console.log(groupname, username)
        const sql = `select * from usergroup where groupname=? and username=? ;`;
        const values = [groupname.toLowerCase(), username.toLowerCase()];

        connection.query(sql, values, (err, results) => {
          if (err) {
            connection.release();
            return reject(err);
          }
          return resolve(results)
        });
      })
    })
  }

}

module.exports = Group;