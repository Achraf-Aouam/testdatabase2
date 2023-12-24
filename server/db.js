const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "DBSB3272",
  host: "localhost",
  post: 5432,
  database: "stockhawk",
});

module.exports = pool;
