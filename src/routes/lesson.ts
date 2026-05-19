import { Router, Response } from "express";
import { db } from "../db";
import { english_levels, lessons, lessons_words, words } from "../db/schema";
import { auth, AuthRequest } from "../middleware/auth";
import { eq } from "drizzle-orm";

const lessonRouter = Router();

// GET: /lessons
lessonRouter.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    // CORRECCIÓN: Seleccionamos los campos y encadenamos el join ANTES del await
    const allLessons = await db
      .select({
        id: lessons.id,
        title: lessons.title,
        description: lessons.description,
        levelId: lessons.levelId,
        levelName: english_levels.name, // ¡Aquí recuperamos el nombre del nivel!
      })
      .from(lessons)
      .innerJoin(english_levels, eq(lessons.levelId, english_levels.id));

    // Responder con el arreglo estructurado (Status 200 OK)
    res.status(200).json(allLessons);
  } catch (e) {
    res.status(500).json({
      amsg: "Hubo un problema al obtener las lecciones",
      error: e instanceof Error ? e.message : String(e),
    });
  }
});

//GET lesson words with full word data
lessonRouter.get(
  "/:lessonId/words",
  async (req: AuthRequest, res: Response) => {
    try {
      const { lessonId } = req.params;

      // Validar que lessonId existe
      const lessonExists = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, Number(lessonId)))
        .limit(1);

      if (lessonExists.length === 0) {
        return res.status(404).json({ amsg: "Lección no encontrada" });
      }

      const allWords = await db
        .select({
          lessonId: lessons_words.lessonId,
          wordId: lessons_words.wordId,
          // Campos de la tabla words (ajusta según tu esquema)
          word: words.word,
          translation: words.translation,
          pronunciation: words.pronunciation,
          audioPath: words.audioPath,
          categoryId: words.categoryId,
        })
        .from(lessons_words)
        .innerJoin(words, eq(lessons_words.wordId, words.id))
        .where(eq(lessons_words.lessonId, Number(lessonId)));

      res.status(200).json(allWords);
    } catch (e) {
      res.status(500).json({
        amsg: "Hubo un problema al obtener las palabras",
        error: e instanceof Error ? e.message : String(e),
      });
    }
  },
);

export default lessonRouter;
