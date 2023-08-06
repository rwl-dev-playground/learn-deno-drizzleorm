import { connect } from "planetscale";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { movieTable } from "../db/schema/movie.ts";
import { generateInsertSql, writeInsertSqlFile } from "./lib.ts";
import "std/dotenv/load.ts";

const connection = connect({
  host: Deno.env.get("PS_HOST"),
  username: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_USERNAME")
    : Deno.env.get("PS_USERNAME"),
  password: Deno.env.get("DEVELOP")
    ? Deno.env.get("PS_DEV_PASSWORD")
    : Deno.env.get("PS_PASSWORD"),
});
const db = drizzle(connection);

const movieResult = await db.select({
  title: movieTable.title,
  is_dubbed: movieTable.is_dubbed,
  is_domestic: movieTable.is_domestic,
  is_live_action: movieTable.is_live_action,
  theater_id: movieTable.theater_id,
  view_date: movieTable.view_date,
  view_start_time: movieTable.view_start_time,
  view_end_time: movieTable.view_end_time,
  accompanier: movieTable.accompanier,
  rating: movieTable.rating,
  comment: movieTable.comment,
}).from(movieTable);
const movieInsertSql = generateInsertSql("tbl_movieinfo", movieResult);

await writeInsertSqlFile("movie", movieInsertSql);
