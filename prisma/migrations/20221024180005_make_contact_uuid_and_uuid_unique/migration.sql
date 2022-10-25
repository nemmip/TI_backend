/*
  Warnings:

  - A unique constraint covering the columns `[uuid,contactUuid]` on the table `Contacts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Contacts_uuid_contactUuid_key" ON "Contacts"("uuid", "contactUuid");
