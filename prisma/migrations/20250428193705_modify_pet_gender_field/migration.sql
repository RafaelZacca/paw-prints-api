/*
  Warnings:

  - Changed the type of `gender` on the `Pet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PetGender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "gender",
ADD COLUMN     "gender" "PetGender" NOT NULL;
