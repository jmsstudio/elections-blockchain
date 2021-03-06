const restify = require('restify');
const request = require('request');

const { registerBlockchain } = require('./sawtooth/client');
const processor = require('./sawtooth/processor');
const { VoteHandler } = require('./sawtooth/voteHandler');
const { searchBlockchain, handlerInfo, getAddress } = require('./sawtooth/infra');

processor(new VoteHandler());

function registerVote(req, res, next) {
  const voto = req.body;
  registerBlockchain(voto);

  res.send(200);
  next();
}

function search(req, res, next) {
  const address = req.params.address;

  searchBlockchain(address, votes => {
    res.send(votes);
    next();
  });
}

const server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());

server.post('/register/vote', registerVote);
server.get('/search/:address', search);
server.get('/search/election/:electionName', (req, res, next) => {
  const electionName = req.params.electionName;
  const address = `${handlerInfo().prefix}${getAddress(electionName, 20)}`;

  searchBlockchain(address, votes => {
    res.send(votes);
    next();
  });
});

server.listen(8084, function() {
  console.log('%s listening at %s', server.name, server.url);
});
