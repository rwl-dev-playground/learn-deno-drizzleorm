import { Hono } from "hono/mod.ts";
import { desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "planetscale";
import {
  movieTable,
  type NewMovie,
  validateInsertMovieSchema,
} from "./db/schema/movie.ts";
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
const app = new Hono();

app.get("/api", async (ctx) => {
  const { limit, distinct } = ctx.req.query();

  if (distinct) {
    const result =
      (await db.selectDistinct({ title: movieTable.title }).from(movieTable))
        .reverse().slice(0, Number(limit));
    return ctx.json(result);
  }
  const result = await db.select({
    title: movieTable.title,
    view_date: movieTable.view_date,
  }).from(movieTable).orderBy(desc(movieTable.view_date)).limit(Number(limit));
  return ctx.json(result);
}).post(async (ctx) => {
  const body = (await ctx.req.parseBody()) as NewMovie;

  const schema = validateInsertMovieSchema(body);
  if (!schema.success) {
    return ctx.json({
      result: 1,
      message: "Validation Error",
    });
  }

  await db.insert(movieTable).values(body);
  return ctx.json({
    result: 0,
    message: "Done!",
  });
});

Deno.serve({ port: 8000 }, app.fetch);
