var Web3 = require('web3');

var abi = [{"constant":false,"inputs":[{"name":"b","type":"address"}],"name":"setBeneficiary","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"z","type":"uint256"}],"name":"operate","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"z","type":"uint256"}],"name":"Operated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"remainingTime","type":"uint256"}],"name":"Busy","type":"event"}];

var sandboxId = '0c1d6a2f67';
var url = 'https://' + window.location.hostname + ':8555/sandbox/' + sandboxId;
var web3 = new Web3(new Web3.providers.HttpProvider(url));

web3.eth.defaultAccount = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var c = web3.eth.contract(abi).at('0x17956ba5f4291844bc25aedb27e69bc11b5bda39');

var watchEvent;
var watchEventBusy;

$(function() {
  
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

  watchEvent = c.Operated({}, {fromBlock: 0, toBlock: 'latest'});
  watchEvent.watch(function(error, result) {
  	setLight(result.args.x, result.args.y, result.args.z);
  });
  
  watchEventBusy = c.Busy({}, {fromBlock: 0, toBlock: 'latest'});
  watchEventBusy.watch(function(error, result) {
  	$('#message').text('Attempt to change light strip color but it is still busy for ' + (result.args.remainingTime) + " seconds.");
  });

});
