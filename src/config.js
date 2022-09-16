const dotenv = require('dotenv');
const joi = require('joi');
const path = require('path');
const pick = require('lodash.pick');

dotenv.config({ path: path.join(__dirname, '../.env') });

const envVarsSchema = joi
  .object()
  .keys({
    MYSQL_HOST: joi.string().required(),
    MYSQL_PORT: joi.number().positive().optional().default(3306),
    MYSQL_USER: joi.string().required(),
    MYSQL_PASSWORD: joi.string().required(),
    MYSQL_DB: joi.string().required(),
    PING_GATEWAY: joi.boolean().optional().default(true),
    GATEWAY_IP: joi.when('PING_GATEWAY', {
      is: true,
      then: joi.string().required(),
      otherwise: joi.string().optional(),
    }),
    PING_HOSTS: joi.string().optional().default('["google.com"]'),
    PING_MIN_REPLY: joi.number().positive().greater(0).default(10),
    PING_FREQUENCY: joi.number().positive().greater(0).default(30),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const fields = [
  'MYSQL_HOST',
  'MYSQL_PORT',
  'MYSQL_USER',
  'MYSQL_PASSWORD',
  'MYSQL_DB',
  'GATEWAY_IP',
  'PING_GATEWAY',
  'PING_HOSTS',
  'PING_MIN_REPLY',
  'PING_FREQUENCY',
];

module.exports = pick(envVars, fields);
