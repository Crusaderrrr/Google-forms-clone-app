const prisma = require('../prisma/prismaClient');


exports.createForm = async (req, res) => {
    try {
        if (req.session.user && req.session.user.role !== 'guest') {
            const templateId = req.body.templateId;
            const answers = req.body.answers;
            const userId = req.session.user.id;

            const questionIds = await prisma.template.findUnique({
                where: { id: templateId },
                select: { questions: { select: { id: true } } }
            })

            const hasMismatch = answers.some(a => !questionIds?.questions.map(q => q.id).includes(a.qId));

            if (!hasMismatch) {
                const newForm = await prisma.form.create({
                    data: {
                        templateId: templateId,
                        userId: userId,
                        answers: {
                            create: answers.map(a => ({
                                questionId: a.qId,
                                value: String(a.value)
                            }))
                        }
                    }
                });
                return res.status(201).json({ message: 'Form created successfully', form: newForm });
            } else {
                return res.status(400).json({ message: 'There is a mismatch in questions and answers' });
            }
            
        } else {
            return res.status(401).json({ message: 'Unauthorized on creating a form' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error occurred on creating a form', error: err.message });
    }
};

exports.getFormInfo = async (req, res) => {
    try {
        if (req.session.user && req.session.user.role !== 'guest') {
            const formInfo = await prisma.form.findUnique({
                where: { id: Number(req.params.id) },
                include: {
                    user: true,
                    template: {
                        include: {
                            tags: { include: { tag: true }},
                            questions: true,
                        }
                    },
                    answers: true, 
                }
            })
            return res.status(200).json({ message: 'FormInfo fetched successfully', formInfo })
        } else {
            return res.status(401).json({ message: 'Unauthorized on fetching a form' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Error occurred on fetching a formInfo', error: err.message })
    }
};

exports.getAllForms = async (req, res) => {
    try {
        if (req.session.user && req.session.user.role !== 'guest') {
            const userId = req.session.user.id;
            const formSectionInfo = await prisma.form.findMany({
                where: { userId : userId },
                select: {
                    id: true,
                    createdAt: true,
                    template: {
                        select: { title: true }
                    }
                }
            });
            return res.status(200).json({ message: 'All forms fetch successful', formSectionInfo })
        } else {
            return res.status(401).json({ message: 'Unauthorized on fetching all forms' })
        }
    } catch (err) {
        res.status(500).json({ message: 'Error occurred on fetching a formInfo', error: err.message })
    }
};