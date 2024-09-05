-- CreateTable
CREATE TABLE "Dashboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,

    CONSTRAINT "Dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "xAxis" TEXT NOT NULL,
    "yAxis" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,
    "dashboardId" INTEGER NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "chartId" INTEGER NOT NULL,

    CONSTRAINT "Filter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_dashboardId_fkey" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filter" ADD CONSTRAINT "Filter_chartId_fkey" FOREIGN KEY ("chartId") REFERENCES "Chart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
