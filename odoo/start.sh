#!/bin/bash
# Install critical dependencies first
pip install werkzeug psycopg2-binary requests

cd /tmp
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git odoo-source
pip install -r odoo-source/requirements.txt --ignore-installed gevent

python odoo-source/odoo-bin \
    --config=/app/odoo.conf \
    --http-port=$PORT \
    --http-interface=0.0.0.0 \
    --workers=0 \
    --max-cron-threads=0
