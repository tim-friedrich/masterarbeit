if(peer.dataChannel.bufferedAmount <= 16000000) {
  peer.dataChannel.send(msg);
  return;
}
// if maximum buffersize is reached delay sending of chunks
peer.requestQueue.push(msg);
peer.dataChannel.bufferedAmountLowThreshold = 65536;
peer.dataChannel.onbufferedamountlow = function () {
  var reqs = peer.requestQueue.slice();
  peer.requestQueue = [];
  reqs.forEach(_msg => send(_msg));
}
