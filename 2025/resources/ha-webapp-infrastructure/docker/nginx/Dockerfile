FROM nginx:alpine

RUN apk add --no-cache keepalived ipvsadm bash

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]