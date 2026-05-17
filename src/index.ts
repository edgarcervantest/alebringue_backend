import express from "express";
import authRouter from "./routes/auth";
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth",authRouter);

app.get("/", (req, res) => {
    res.send("Bienvenido a la app");
});

const PORT = process.env.PORT || 8000

app.listen(Number(PORT), '0.0.0.0', () => {
    console.log("Servidor corriendo en puerto ${PORT}");
});