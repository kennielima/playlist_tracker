import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { PrismaClient } from '../generated/prisma'
import prisma from './db/prisma.ts';
const app = express();
const PORT = process.env.PORT || 4001;

app.use(express.json());
app.use(cors());
dotenv.config();

async function main() {
    const chart = await prisma.chart.count()
    console.log("Prisma Client initialized", chart);
}
main()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})