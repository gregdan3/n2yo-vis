FROM httpd:2
COPY ./app/* /usr/local/apache2/htdocs/
RUN chown -R daemon:daemon /usr/local/apache2/htdocs/
EXPOSE 80 443
