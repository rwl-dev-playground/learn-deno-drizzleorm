import { type InferModel } from "drizzle-orm";
import {
  boolean,
  int,
  mysqlTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/mysql-core";

export const movieTable = mysqlTable("tbl_movieinfo", {
  id: serial("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 246 }).notNull(),
  is_dubbed: boolean("is_dubbed"),
  is_domestic: boolean("is_domestic"),
  is_live_action: boolean("is_live_action"),
  theater_id: int("theater_id").notNull(),
  view_date: varchar("view_date", { length: 10 }).notNull(),
  view_start_time: varchar("view_start_time", { length: 5 }),
  view_end_time: varchar("view_end_time", { length: 5 }),
  accompanier: int("accompanier"),
  rating: int("rating"),
  comment: text("comment"),
});

export type Movie = InferModel<typeof movieTable>;
export type NewMovie = InferModel<typeof movieTable, "insert">;
