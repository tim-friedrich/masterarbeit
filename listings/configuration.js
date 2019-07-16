var config = {
  channel: 'FIXED_CLASS_1',
  clientId: '<%= peerId %>',
  idLength: 32,
  stunServer: {
    'iceServers': [
      // {
      //   'urls': 'stun:stun.l.google.com:19302',
      // },
    ]
  },
  verbose: true,
  serviceWorker: {
    urlsToShare:
      [
        '/img/',
        '/video/',
        '/testfiles/'
      ],
    path: '/p2pCDNsw.js',
    scope: '/',
    basePath: '/',
    storageQuota: '10000',
    cachingEnabled: false,
    verbose: true,
    statisticPath: '/logs'
  }
};
var cdn = new P2pCDN(config);
