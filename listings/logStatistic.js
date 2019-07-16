function logStatistic(url, method, request, timing, from, peerId) {
  if(!config.statisticPath) return;
  var p_Id = peerId ? peerId : config.clientId;
  var data = {
    'peerId': p_Id,
    'method': method,
    'from': from,
    'url': url,
    'loadTime': timing
  };
  requests.push(data);
  sendStatisticToServer();
}
