-- CreateTable
CREATE TABLE "ChartTime" (
    "id" TEXT NOT NULL,
    "chartId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChartTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChartTime" ADD CONSTRAINT "ChartTime_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
