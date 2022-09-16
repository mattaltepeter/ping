# ping

This is a simple application to track ping results over a period of time. This repo includes a docker-compose script to create a mysql container as well as dockerize the nodejs application.

## Getting Started

- clone the repo and `cd` into it
- copy the `.env.example` to `.env`
  - fill out the desired details for the mysql container and connection
  - - `MYSQL_HOST` should be left alone if you are going to run it via `docker-compose`
  - fill out other optional env keys:
  - - `PING_GATEWAY` boolean to ping your local network (defaults to false)
  - - `GATEWAY_IP` string representing gateway IP
  - - `PING_HOSTS` json encoded array of domains to ping (defaults to just google.com)
  - - `PING_MIN_REPLY` number of `ECHO_REQUESTS` to send
  - - `PING_FREQUENCY` (seconds) the node application runs a `setTimeout` to run the pings to all the hosts every X seconds (defaults to 30)

## Running

### via `docker-compose`

```
docker-compose up
```

### without docker

_Note: in this case you must have a standalone mysql server running_

```
npm start
```
