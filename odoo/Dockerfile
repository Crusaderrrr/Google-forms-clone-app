FROM odoo:17.0
RUN pip install psycopg2-binary requests
COPY ./addons /mnt/extra-addons
COPY ./odoo/odoo.conf /etc/odoo/
EXPOSE 8069
CMD ["odoo"]
