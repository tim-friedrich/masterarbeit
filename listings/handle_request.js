function handleRequest(url, clientId) {
  return new Promise((resolve) => {
    var startTime = performance.now();

    sha256(url).then(hash => {

      // check cache
      getFromCache(hash).then(cacheResponse => {
        if (cacheResponse && config.cachingEnabled) {
          log('cacheResponse ' + cacheResponse.url);

          // This notify should not be needed
          notifyPeersAboutAdd(hash, clientId);
          var endTime = performance.now();
          logStatistic(url, 'cacheResponse', cacheResponse, endTime-startTime, 'cache');
          resolve(cacheResponse);
          return;
        }
        // check peers
        getFromClient(clientId, hash).then(data => {
          if (data && data.response) {
            var peerResponse = data.response;
            log('peerResponse ' + peerResponse.url);
            putIntoCache(hash, peerResponse, clientId);
            notifyPeersAboutAdd(hash, clientId);
            var endTime = performance.now();
            logStatistic(
              url,
              'peerResponse',
              peerResponse,
              endTime-startTime,
              data.from,
              data.peerId
            );
            resolve(peerResponse);
            return;
          }
          // get from the internet
          getFromInternet(url).then(response => {
            log('serverResponse ' + response.url);
            putIntoCache(hash, response, clientId);
            notifyPeersAboutAdd(hash, clientId);
            var endTime = performance.now();
            logStatistic(url, 'serverResponse', response, endTime-startTime, 'server');
            resolve(response);
          });
        });
      });
    });
  });
}
