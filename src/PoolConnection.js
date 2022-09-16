const mysql = require('mysql');

class PoolConnection {
  constructor(config, objectConfig = true) {
    this.objectConfig = objectConfig;
    this.conn = mysql.createPool(config);
  }

  formatQuery() {
    return function (query, values) {
      if (!values) return query;
      return query.replace(
        /:(\w+)/g,
        function (txt, key) {
          if (values.hasOwnProperty(key)) {
            return this.escape(values[key]);
          }

          return txt;
        }.bind(this)
      );
    };
  }

  getConnection() {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) {
          return reject(err);
        }

        return resolve(conn);
      });
    });
  }

  async query(q, params = {}, objectConfig = false) {
    return new Promise(async (resolve, reject) => {
      let conn;
      try {
        conn = await this.getConnection();
      } catch (e) {
        return reject(e);
      }

      if (objectConfig || this.objectConfig) {
        conn.config.queryFormat = this.formatQuery();
      }

      conn.query(q, params, (error, results) => {
        conn.config.queryFormat = undefined;
        conn.release();
        if (error) {
          return reject(error);
        }

        return resolve(results);
      });
    });
  }
}

module.exports = PoolConnection;
