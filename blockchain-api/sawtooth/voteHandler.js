'use strict';

const { createHash } = require('crypto');
const { Decoder } = require('cbor');

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions');
const { calculateVoteAddress, handlerInfo } = require('./infra');

// Encoding helpers and constants
const getAddress = (key, length = 64) => {
  return createHash('sha512')
    .update(key)
    .digest('hex')
    .slice(0, length);
};

const encode = obj => Buffer.from(JSON.stringify(obj, Object.keys(obj).sort()));

class VoteHandler extends TransactionHandler {
  constructor() {
    console.log('initiating smart contract...');
    const info = handlerInfo();
    super(info.family, [info.version], [info.prefix]);
  }

  apply(txn, context) {
    console.log('new transaction received');

    const dataDecoded = Decoder.decodeFirstSync(txn.payload);
    const payload = JSON.parse(dataDecoded);

    const blockAddress = calculateVoteAddress(payload);
    const { candidateNumber, ellectionName } = payload;

    return context.setState({
      [blockAddress]: encode({ candidateNumber, ellectionName }),
    });
  }
}

module.exports = {
  VoteHandler,
};
