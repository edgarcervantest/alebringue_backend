import { Router, Response } from "express";
import { db } from "../db";
import { lessons } from "../db/schema"; // 1. Importa la tabla de lecciones
import { auth, AuthRequest } from "../middleware/auth";

const lessonRouter = Router();

// GET: /lessons
lessonRouter.get("/", auth, async (req: AuthRequest, res: Response) => {
  try {
    // 2. Consulta a la base de datos para traer todas las lecciones
    const allLessons = await db.select().from(lessons);

    // 3. Responder con el arreglo de lecciones (Status 200 OK)
    res.status(200).json(allLessons);
  } catch (e) {
    // Manejo de errores consistente con tu backend
    res.status(500).json({
      amsg: "Hubo un problema al obtener las lecciones",
      error: e instanceof Error ? e.message : String(e),
    });
  }
});

export default lessonRouter;