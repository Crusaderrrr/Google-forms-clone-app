# in models/models.py
from odoo import models, fields

class FormTemplate(models.Model):
    """
    Stores the main template information imported from the external API.
    """
    _name = 'form.api.template'
    _description = 'Form Template (from API)'
    _order = 'name'

    name = fields.Char(string="Template Title", required=True, readonly=True)
    author_name = fields.Char(string="Author Name", readonly=True)
    
    # This external ID is CRUCIAL for matching records during import.
    external_id = fields.Integer(string="External ID", readonly=True, index=True)
    
    # This creates the relationship: one template has many questions.
    question_ids = fields.One2many(
        'form.api.question', 
        'template_id', 
        string="Questions",
        readonly=True
    )

class TemplateQuestion(models.Model):
    """
    Stores the aggregated data for each question of a template.
    """
    _name = 'form.api.question'
    _description = 'Template Question (from API)'
    _order = 'template_id, name'

    name = fields.Text(string="Question Text", required=True, readonly=True)
    question_type = fields.Char(string="Question Type", readonly=True)
    answer_count = fields.Integer(string="Number of Answers", readonly=True)
    
    # --- Fields for Aggregated Results ---
    average_value = fields.Float(string="Average", digits=(16, 2), readonly=True)
    min_value = fields.Float(string="Min Value", digits=(16, 2), readonly=True)
    max_value = fields.Float(string="Max Value", digits=(16, 2), readonly=True)
    
    # A text field to hold a summary of the most popular answers.
    popular_answers = fields.Text(string="Most Popular Answers", readonly=True)

    template_id = fields.Many2one(
        'form.api.template', 
        string="Template", 
        ondelete='cascade', 
        required=True
    )
