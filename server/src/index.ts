import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from './lib/prisma.ts';
import chartRoutes from "./routes/chart.route.ts";
import authRoutes from "./routes/auth.route.ts";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 4001;
dotenv.config();

app.use(express.json());
app.use(cors({
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(cookieParser())

app.use("/api/charts", chartRoutes);
app.use("/api/auth", authRoutes);

async function main() { console.log("Prisma Client initialized") }
main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})