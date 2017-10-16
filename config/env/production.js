module.exports = {
  port: 80,
  realHost: "http://sociis.com",
  sockets: {
    adapter: 'socket.io-redis',
    host: '127.0.0.1',
    port: 6379,
    db: 0,
  }
};