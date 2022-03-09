const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  password: "b0bdylan",
  host: "localhost",
  port: 5432,
  database: "ayradejs",
});
module.exports = pool;
