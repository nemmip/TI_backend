/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `PartyGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PartyGroup_code_key" ON "PartyGroup"("code");
