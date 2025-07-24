import express from "express";
import cors from "cors";
// import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = process.env.PORT || 4001;
// const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})