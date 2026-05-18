import { Router, Response } from "express";
import { db } from "../db";
import { english_levels, lessons } from "../db/schema";
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

export default lessonRouter;
