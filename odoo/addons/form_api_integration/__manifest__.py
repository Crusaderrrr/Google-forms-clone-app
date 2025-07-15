{
    'name': "Form API Integration",
    'summary': "Imports aggregated form results from an external API.",
    'description': """
This module imports form template data from an external API and displays it in Odoo.
    """,
    'author': "Your Name",
    'website': "https://www.yourcompany.com",
    'category': 'Tools',
    'version': '1.1', 
    'license': 'LGPL-3',
    'depends': ['base'],
    'data': [
        'security/ir.model.access.csv',
        'views/views.xml',
        'views/import_wizard_views.xml', 
    ],
    'installable': True,
    'application': True,
    'auto_install': False,
}
