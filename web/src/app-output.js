var Web3 = require('web3');

var sandboxId = '0e77f0ff7a';
var abi = [{"constant":false,"inputs":[{"name":"b","type":"address"}],"name":"setBeneficiary","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"z","type":"uint256"}],"name":"operate","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"z","type":"uint256"},{"indexed":false,"name":"timespan","type":"uint256"}],"name":"Operated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"remainingTime","type":"uint256"}],"name":"Busy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"}],"name":"BeneficiaryChanged","type":"event"}];
var url = 'https://' + window.location.hostname + ':8555/sandbox/' + sandboxId;
var web3 = new Web3(new Web3.providers.HttpProvider(url));

var ownerAccount = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';
var beneficiaryAccount = '0x38f388fadf4a6a35c61c3f88194ec5ae162c8944';
var userAccount = '0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826';
var contractAccount = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';

web3.eth.defaultAccount = ownerAccount;

var c = web3.eth.contract(abi).at();

var watchEvent;
var watchEventBusy;
var watchEventBeneficiaryChanged;

var watchAccount;

$(function() {
  
  c.setBeneficiary(beneficiaryAccount);
  
  var setInput = function(field, value) {
	  document.getElementById(field).value = value;
  }

  var getInput = function(field) {
	  return parseInt(document.getElementById(field).value);
  }

  var setLight = function(r, g, b) {
  	var e = document.getElementById('light');
  
  	e.innerText = r + " - " + g + " - " + b;
  	
  	e.style.background = "rgb(" + r + "," + g + "," + b + ")";
  }
  
  var appendMessage = function(m) {
    var ta = $('#message');
    
    ta.val(m + "\n" + ta.val());
  }

  watchEvent = c.Operated({}, {fromBlock: 0, toBlock: 'latest'});
  watchEvent.watch(function(error, result) {
  	setLight(result.args.x, result.args.y, result.args.z);
  	
  	appendMessage('light strip operated by ' + (result.args.who) + ': reservation was done for ' + (result.args.timespan) + ' seconds.');
  	appendMessage('balance in beneficiary account: ' + web3.eth.getBalance(beneficiaryAccount));
  });
  
  watchEventBusy = c.Busy({}, {fromBlock: 0, toBlock: 'latest'});
  watchEventBusy.watch(function(error, result) {
    if (error) {
      appendMessage('error occured: '+ error);
    } else {
    	appendMessage('Attempt to change light strip color but it is still busy for ' + (result.args.remainingTime) + " seconds.");
      appendMessage('result: ' + JSON.stringify(result));
    }
  });

  watchEventBeneficiaryChanged = c.BeneficiaryChanged({}, {fromBlock: 0, toBlock: 'latest'});
  watchEventBeneficiaryChanged.watch(function(error, result) {
    if (error) {
      appendMessage('error occured: '+ error);
    } else {
    	appendMessage('changed beneficiary: ' + result.args.receiver);
    }
  });
  

});
