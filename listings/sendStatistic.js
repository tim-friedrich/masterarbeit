function sendStatisticToServer() {
  if(!serverSendTimeout && config.statisticPath){
    serverSendTimeout = setTimeout(function(){
      try {
        fetch(config.statisticPath, {
          method: 'POST',
          body: JSON.stringify(requests),
          headers:{
            'Content-Type': 'application/json'
          }
        });
      } catch(e) {

      } finally {
        serverSendTimeout = 0;
        requests = [];
      }
    }, sendStatisticDelay)
  }
}
