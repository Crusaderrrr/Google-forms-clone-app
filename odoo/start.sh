#!/bin/bash
cd ~
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git odoo-source
pip install -r ~/odoo-source/requirements.txt
python ~/odoo-source/odoo-bin --config=/app/odoo.conf --http-port=$PORT