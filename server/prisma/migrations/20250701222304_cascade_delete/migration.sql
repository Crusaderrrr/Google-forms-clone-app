-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_templateId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_templateId_fkey";

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
