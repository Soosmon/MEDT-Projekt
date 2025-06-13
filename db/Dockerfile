FROM mysql:8
ENV MYSQL_DATABASE=notesdb
ENV MYSQL_ROOT_PASSWORD=root
COPY init.sql /docker-entrypoint-initdb.d/
