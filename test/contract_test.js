var assert = require('assert');
var Compiler = require('solidity-compiler');
var Sandbox = require('ethereum-sandbox-client');

describe('Contract', function() {
  this.timeout(60000);

  var compiler = new Compiler('contracts');
  var sandbox = new Sandbox('http://localhost:8555');
  var contract;

  /* Boilerplate to start sandbox and set up contract */
  before(function(done) {
    sandbox.start(function(err) {
      if (err) return done(err);

      compiler.compile('lkcmp.sol', function(err, compiled) {
        if (err) return done(err);

        contract = sandbox.web3.eth.contract(compiled[0].abi).new({
          data: '0x' + compiled[0].binary
        }, function(err, created) {
          if (err) return done(err);
          if (created.address) done();
        });
      });
    });
  });

  it('changes beneficiary', function(done) {
    var beneficiaryAccount = '0x38f388fadf4a6a35c61c3f88194ec5ae162c8944';

    var finish = function(err) {
      watchEventBeneficiaryChanged.stopWatching();
      done(err);
    };

    var watchEventBeneficiaryChanged = contract.BeneficiaryChanged({}, {
      fromBlock: 0,
      toBlock: 'latest'
    });
    watchEventBeneficiaryChanged.watch(function(error, result) {
      if (error) {
        finish(error);
      }
      else {
        assert.equal(result.args.receiver, beneficiaryAccount);
        finish();
      }
    });

    contract.setBeneficiary(beneficiaryAccount, function(err) {
      if (err) finish(err);
    });

  });

  /* Boilerplate to tear down sandbox */
  after(function(done) {
    sandbox.stop(function(err) {
      done(err);
    });
  });

});
