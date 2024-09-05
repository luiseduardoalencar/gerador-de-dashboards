-- CreateTable
CREATE TABLE "Kpi" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "expressionId" INTEGER NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "Kpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expression" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "formula" TEXT NOT NULL,

    CONSTRAINT "Expression_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Kpi" ADD CONSTRAINT "Kpi_expressionId_fkey" FOREIGN KEY ("expressionId") REFERENCES "Expression"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kpi" ADD CONSTRAINT "Kpi_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
