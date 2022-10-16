-- CreateTable
CREATE TABLE "User" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "groupUuid" VARCHAR(36),

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Contacts" (
    "uuid" VARCHAR(36) NOT NULL,
    "contactUuid" TEXT NOT NULL,

    CONSTRAINT "Contacts_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "PartyGroup" (
    "uuid" VARCHAR(36) NOT NULL,
    "code" VARCHAR(8) NOT NULL,
    "currency" TEXT NOT NULL,

    CONSTRAINT "PartyGroup_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Bill" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "payedBy" VARCHAR(36) NOT NULL,
    "groupUuid" VARCHAR(36) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "PartyGroup"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacts" ADD CONSTRAINT "Contacts_contactUuid_fkey" FOREIGN KEY ("contactUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_payedBy_fkey" FOREIGN KEY ("payedBy") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "PartyGroup"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
