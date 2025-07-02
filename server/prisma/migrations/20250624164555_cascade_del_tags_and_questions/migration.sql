-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_templateId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateTag" DROP CONSTRAINT "TemplateTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "TemplateTag" DROP CONSTRAINT "TemplateTag_templateId_fkey";

-- AddForeignKey
ALTER TABLE "TemplateTag" ADD CONSTRAINT "TemplateTag_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateTag" ADD CONSTRAINT "TemplateTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
