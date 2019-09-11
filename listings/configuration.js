var config = {
  channel: '<%= peerMesh %>',
  clientId: '<%= peerId %>',
  idLength: '<%= maxIdLength %>',
  stunServer: {
    'iceServers': [
      {
        'urls': '<%= stunServer %>',
      },
    ]
  },
  verbose: true,
  serviceWorker: {
    urlsToShare: ['/img/'],
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
