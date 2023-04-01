FROM node:14

RUN apt update && \
    apt install -y wget netcat && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]