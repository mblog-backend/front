#!/bin/sh

sed -i 's#REPLACE_URL_HERE#'"$MBLOG_SERVER_URL"'#g' `grep 'REPLACE_URL_HERE' -rl /usr/share/nginx/html`

nginx -g 'daemon off;'