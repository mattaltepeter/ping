FROM node:16.15

ENV TZ=UTC

COPY . /code/ping

RUN cd /code/ping \
  && npm install

WORKDIR /code/ping

CMD ["npm", "start"]