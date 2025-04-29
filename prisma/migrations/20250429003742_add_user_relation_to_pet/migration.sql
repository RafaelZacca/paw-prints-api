ALTER TABLE "Pet"
ADD COLUMN "userId" INTEGER NOT NULL DEFAULT 1; -- Assigns userId=1 to existing pets

ALTER TABLE "Pet"
ADD CONSTRAINT "Pet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL;
