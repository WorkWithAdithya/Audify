import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
});
export async function sql(strings, ...values) {
    let text = strings[0] ?? "";
    for (let i = 0; i < values.length; i++) {
        text += `$${i + 1}` + (strings[i + 1] ?? "");
    }
    const result = await pool.query(text, values);
    return result.rows;
}
