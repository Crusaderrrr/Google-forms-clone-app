#!/bin/bash
cd /tmp
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git odoo-source
pip install -r odoo-source/requirements.txt --ignore-installed gevent

python odoo-source/odoo-bin \
    --config=/app/odoo.conf \
    --workers=1 \
    --max-cron-threads=0 \
    --http-port=$PORT \
    --http-interface=0.0.0.0 \
    --limit-memory-soft=536870912 \
    --limit-memory-hard=671088640 \
    --no-database-list
