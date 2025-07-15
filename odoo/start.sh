#!/bin/bash
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git /app/odoo-source
pip install -r /app/odoo-source/requirements.txt
python /app/odoo-source/odoo-bin --config=/app/odoo.conf --http-port=$PORT
