-- AlterTable
ALTER TABLE "Template" ADD COLUMN     "access" TEXT NOT NULL DEFAULT 'public';

-- CreateTable
CREATE TABLE "_TemplateAllowedUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TemplateAllowedUsers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TemplateAllowedUsers_B_index" ON "_TemplateAllowedUsers"("B");

-- AddForeignKey
ALTER TABLE "_TemplateAllowedUsers" ADD CONSTRAINT "_TemplateAllowedUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TemplateAllowedUsers" ADD CONSTRAINT "_TemplateAllowedUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
