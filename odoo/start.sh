#!/bin/bash
cd /tmp
git clone --depth 1 --branch 17.0 https://github.com/odoo/odoo.git odoo-source
pip install -r odoo-source/requirements.txt

# Add explicit host binding and longer timeout
python odoo-source/odoo-bin \
    --config=/app/odoo.conf \
    --http-port=$PORT \
    --http-interface=0.0.0.0 \
    --workers=0 \
    --max-cron-threads=0 \
    --limit-memory-soft=536870912 \
    --limit-memory-hard=671088640