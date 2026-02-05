import "dotenv/config"
import mysql from "mysql2/promise";

const pool = mysql.createPool({ //createPool handles multiple simultaneous API requests at once, opens multiple connections, pool manages to reconnect logic for us
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;