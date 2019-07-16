_sendChunkedToPeer(peer, hash, dataAb) {
  this.logDetail('have to chunk data %s', hash);
  const s = this.message.sizes;
  const dataSize = dataAb.byteLength;
  const chunkSize = s.maxData - (s.peerId + s.hash + s.type + s.chunkId + s.chunkCount);
  const chunkCount = Math.ceil(dataSize / chunkSize);

  const applyPadding = (number, length) => {
    let result = number.toString();

    while(result.length < length) {
      result = '0' + result;
    }

    return result;
  };

  const buildChunk = (id, max, dataAb) => {
    const idAb = strToAb(id);
    const maxAb = strToAb(max);

    return concatAbs([idAb, maxAb, dataAb]);
  };

  let chunkEnd = chunkSize;
  let chunkId = 0;

  for (let i = 0; i < dataSize; i += chunkSize) {
    let chunkAb;
    if (i < dataSize) {
      chunkAb = new Uint8Array(dataAb.slice(i, chunkEnd));
    } else {
      chunkAb = new Uint8Array(dataAb.slice(i));
    }
    chunkEnd += chunkSize;

    const id = applyPadding(chunkId, s.chunkId);
    const count = applyPadding(chunkCount, s.chunkCount);
    const chunk = buildChunk(id, count, chunkAb);
    this._sendToPeer(peer, this.message.types.chunk, hash, chunk);
    chunkId += 1;
  }
  this.logDetail('sent chunked data for %s', hash);
}
