getFromCache(hash).then(cacheResponse => {
  if (cacheResponse && config.cachingEnabled) {
    resolve(cacheResponse);
    return;
  }
  getFromClient(clientId, hash).then(data => {
    if (data && data.response) {
      resolve(data.response);
      return;
    }
    getFromInternet(url).then(response => {
      resolve(response);
    });
  });
});
