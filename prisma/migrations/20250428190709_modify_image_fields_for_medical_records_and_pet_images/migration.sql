/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `MedicalRecord` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `PetImage` table. All the data in the column will be lost.
  - Added the required column `imageBase64` to the `MedicalRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageBase64` to the `PetImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MedicalRecord" DROP COLUMN "imageUrl",
ADD COLUMN     "imageBase64" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PetImage" DROP COLUMN "imageUrl",
ADD COLUMN     "imageBase64" TEXT NOT NULL;
