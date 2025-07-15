import requests
from odoo import models, fields
from odoo.exceptions import UserError

class ImportWizard(models.TransientModel):
    _name = 'form.api.import.wizard'
    _description = 'Form API Import Wizard'

    api_token = fields.Text(string="API Token", required=True)

    def action_import_data(self):
        self.ensure_one()
        
        # --- IMPORTANT: Change this URL to your API's address ---
        # If running locally, use the Ngrok URL for your Express API
        api_url = "http://host.docker.internal:5000/api/odoo/get-templates" 
        headers = {'Authorization': f'Bearer {self.api_token}'}

        try:
            response = requests.get(api_url, headers=headers, timeout=20)
            response.raise_for_status() # Raises an error for 4xx or 5xx responses
        except requests.exceptions.HTTPError as e:
            raise UserError(f"API Error: {e.response.status_code} - {e.response.text}")
        except requests.exceptions.RequestException as e:
            raise UserError(f"Could not connect to the API. Check the URL and network. Error: {e}")

        data = response.json().get('data', [])
        Template = self.env['form.api.template']
        Question = self.env['form.api.question']

        for template_data in data:
            template = Template.search([('external_id', '=', template_data['template_id_external'])], limit=1)
            
            template_vals = {
                'name': template_data['template_title'],
                'author_name': template_data['author_name'],
                'external_id': template_data['template_id_external'],
            }

            if not template:
                template = Template.create(template_vals)
            else:
                template.write(template_vals)
            
            template.question_ids.unlink()

            questions_to_create = []
            for q_data in template_data.get('questions', []):
                agg_res = q_data.get('aggregated_result', {})
                
                popular_answers_str = ""
                if 'most_popular' in agg_res:
                    popular_answers_str = "\n".join([f"- {item['answer']} ({item['count']} times)" for item in agg_res.get('most_popular', [])])

                questions_to_create.append({
                    'name': q_data['question_text'],
                    'question_type': q_data['question_type'],
                    'answer_count': q_data['answer_count'],
                    'average_value': agg_res.get('average'),
                    'min_value': agg_res.get('min'),
                    'max_value': agg_res.get('max'),
                    'popular_answers': popular_answers_str,
                    'template_id': template.id,
                })
            
            if questions_to_create:
                Question.create(questions_to_create)
        
        # After import, refresh the view to show the new data
        return { 'type': 'ir.actions.client', 'tag': 'reload' }