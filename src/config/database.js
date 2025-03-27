// const { Pool } = require("pg");
const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");

dotenv.config();
// const pool = new Pool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool
//   .connect()
//   .then(() => {
//     console.log("Database connected!");
//   })
//   .catch((err) => {
//     console.log("Database connection error: ", err);
//   });

// module.exports = pool;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
