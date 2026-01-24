-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ELECTRONIC', 'CLOTHES', 'FOOD');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category";
