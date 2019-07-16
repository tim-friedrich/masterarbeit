_handleChunk(message) {
  const req = this._getRequest(message.from, message.hash);
  var response = {};
  req.chunks.push({id: message.chunkId, data: message.data});

  if(req.chunks.length === message.chunkCount) {
    response.data = this._concatMessage(req.chunks);
    response.from = message.from;
    response.peerId = this.peerId;
    this._removeRequest(message.from, message.hash);
    req.respond(response);
  }
}
