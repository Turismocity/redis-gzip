/* eslint-disable no-console, class-methods-use-this */
/* eslint-disable no-param-reassign, no-underscore-dangle, comma-dangle */

const { promisify } = require('util');

const redis = require('redis');
const zlib = require('zlib');

const singletons = {};

function buildRedisGzip(hostname, port) {
  console.log(`Connect to redis server: ${hostname}:${port}`);

  const client = redis.createClient(port, hostname, {
    detect_buffers: true,
  });

  client.on('error', (error) => {
    console.error(`REDIS error event -  + ${hostname} + : + ${port} +  ERROR: %j`, error);
  });

  const redisGet = promisify(client.get.bind(client));
  const redisSet = promisify(client.set.bind(client));
  const redisExists = promisify(client.exists.bind(client));
  const redisTTL = promisify(client.ttl.bind(client));

  const gunzip = promisify(zlib.gunzip.bind(zlib));
  const gzip = promisify(zlib.gzip.bind(zlib));

  function connect(cb) {
    if (cb === null) {
      return null;
    }
    return cb();
  }

  function close() {
    client.quit();
  }

  async function exists(key) {
    const ret = await redisExists(key);
    return !!ret;
  }

  function simpleset(key, value, expire) {
    if (Number.isInteger(expire)) {
      return redisSet(key, value, 'EX', expire);
    }
    return redisSet(key, value);
  }

  async function set(key, value, expire) {
    const compresed = await gzip(value);
    return simpleset(key, compresed, expire);
  }

  async function get(key, verbose = false) {
    const data = await redisGet(Buffer.from(key));
    if (!data) {
      if (verbose) {
        const message = `REDIS: no data for key: ${key}`;
        console.log(message);
        const emptyDataError = new Error(message);
        console.log(emptyDataError.stack);
      }
      return undefined;
    }
    try {
      const decompresed = await gunzip(data);
      return decompresed.toString();
    } catch (e) {
      return data.toString();
    }
  }

  return {
    client,
    connect,

    close,
    exists,
    simpleset,
    simpleget: redisGet,
    ttl: redisTTL,

    set,
    get,
  };
}

module.exports = function redisSingleton(hostname = 'localhost', port = 6379) {
  const hash = `${hostname}:${port}`;
  if (singletons[hash]) {
    return singletons[hash];
  }
  singletons[hash] = buildRedisGzip(hostname, port);

  return singletons[hash];
};
