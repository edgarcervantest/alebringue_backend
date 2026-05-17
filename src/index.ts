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
    res.send("Bienvenido a la Apps amigo");
});

app.listen(8000, '0.0.0.0', () => {
    console.log("Server corriendo http://localhost:8000");
});