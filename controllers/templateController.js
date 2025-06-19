const prisma = require('../prisma/prismaClient')

exports.getAllTemplates = async (req, res) => {
    try {
        if (req.session.user.role !== 'guest') {
            const userId = req.session.user.id;
            const templates = await prisma.template.findMany({
                where: { userId }
            });
            res.status(200).json({message: 'All templates fetch successful', templates: templates})
        } else {
            res.status(401).json({message: 'Unauthorized on fetching templates'})
        }
    } catch (err) {
        res.status(500).json({message: 'Error during fetching all templates', error: err.message})
    }
};