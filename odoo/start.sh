#!/bin/bash
rm -rf /tmp/odoo-source
cd /tmp
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git odoo-source
pip install -r odoo-source/requirements.txt
python odoo-source/odoo-bin --config=/app/odoo.conf --http-port=$PORT --http-interface=0.0.0.0
