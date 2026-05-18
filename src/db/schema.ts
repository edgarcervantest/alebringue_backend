import {
  pgTable,
  text,
  uuid,
  serial,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { table } from "node:console";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userType: text("user_type").notNull().default("user"),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const english_levels = pgTable("english_levels", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Level = typeof english_levels.$inferSelect;
export type NewLevel = typeof english_levels.$inferInsert;

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  levelId: integer("level_id").references(() => english_levels.id).notNull(),
});

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull(),
  translation: text("translation").notNull(),
  pronunciation: text("pronunciation").notNull(),
  audioPath: text("audio_path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  categoryId: integer("category_id").references(() => categories.id).notNull(),
});

export type Word = typeof words.$inferSelect;
export type NewWord = typeof words.$inferInsert;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;

export const lessons_words = pgTable(
  "lessons_words",
  {
    lessonId: integer("lesson_id").references(() => lessons.id).notNull(),
    wordId: integer("word_id").references(() => words.id).notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.lessonId, table.wordId] }),
  }),
);

export type LessonWord = typeof lessons_words.$inferSelect;
export type NewLessonWord = typeof lessons_words.$inferInsert;
