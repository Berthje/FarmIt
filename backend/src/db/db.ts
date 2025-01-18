import { Pool } from "@x/postgres";

const pool = new Pool({
  user: Deno.env.get("DB_USER"),
  password: Deno.env.get("DB_PASSWORD"),
  database: Deno.env.get("DB_NAME"),
  hostname: Deno.env.get("DB_HOST"),
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
}, 8);

export const query = async (sql: string, params: Array<unknown> = []) => {
  using client = await pool.connect();

  return await client.queryObject(sql, params);
};
