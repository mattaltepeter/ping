const ping = require('ping');
const moment = require('moment');

const config = require('./config');
const PoolConnection = require('./PoolConnection');

const PING_HOSTS = JSON.parse(config.PING_HOSTS);
const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const db = new PoolConnection({
  host: config.MYSQL_HOST,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DB,
  port: config.MYSQL_PORT,
  connectionLimit: 5,
});

function format(data) {
  return {
    host: data.host,
    resolvedIp: data.numeric_host,
    min: data.min,
    max: data.max,
    avg: data.avg,
    stddev: data.stddev,
    packetLoss: data.packetLoss,
    output: data.output,
    isGateway: data.host === config.GATEWAY_IP,
  };
}

async function probe(hostOrIp) {
  const result = await ping.promise.probe(hostOrIp, {
    min_reply: config.PING_MIN_REPLY,
  });

  return format(result);
}

function pingHosts(hosts) {
  return Promise.all(hosts.map(async (host) => probe(host)));
}

function buildSet(data) {
  const parts = [];
  for (const [key] of Object.entries(data)) {
    parts.push(`\`${key}\` = :${key}`);
  }

  return parts.join(', ');
}

async function pingInsert() {
  console.log('starting ping...');
  const startTime = moment().format(DATE_FORMAT);
  const hosts = config.PING_GATEWAY
    ? [config.GATEWAY_IP, ...PING_HOSTS]
    : PING_HOSTS;
  if (!hosts.length) {
    throw new Error('No ping hosts found');
  }

  const endTime = moment().format(DATE_FORMAT);
  const results = await pingHosts(hosts);

  try {
    const rows = await Promise.all(
      results.map((result) => {
        const params = {
          ...result,
          packetsSent: config.PING_MIN_REPLY,
          startTime,
          endTime,
        };
        const sql = `insert into \`results\` set ${buildSet(params)}`;
        return db.query(sql, params, true);
      })
    );

    console.log(
      `inserted rows: ${rows
        .map(({ insertId }) => insertId)
        .sort()
        .join(', ')}`
    );

    setTimeout(pingInsert, config.PING_FREQUENCY * 1000);
  } catch (e) {
    console.error('Error inserting record(s)');
    console.error(e);
  }
}

pingInsert();
