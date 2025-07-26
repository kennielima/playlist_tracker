import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from './lib/prisma.ts';
import chartRoutes from "./routes/chart.route.ts";


const app = express();
const PORT = process.env.PORT || 4001;
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/charts", chartRoutes);

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