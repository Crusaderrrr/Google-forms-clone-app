# -*- coding: utf-8 -*-
# from odoo import http


# class FormApiIntegration(http.Controller):
#     @http.route('/form_api_integration/form_api_integration', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/form_api_integration/form_api_integration/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('form_api_integration.listing', {
#             'root': '/form_api_integration/form_api_integration',
#             'objects': http.request.env['form_api_integration.form_api_integration'].search([]),
#         })

#     @http.route('/form_api_integration/form_api_integration/objects/<model("form_api_integration.form_api_integration"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('form_api_integration.object', {
#             'object': obj
#         })

