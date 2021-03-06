var Web3 = require('web3');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("./server/config.json", "utf8"));
var profile = config[config.profile];

var url;
switch (profile.provider) {
  case 'nodeUrl':
    url = profile.nodeUrl;
    break;
  case 'sandbox':
  default:
    url = 'https://' + profile.hostname + ':8555/sandbox/' + profile.sandboxId;
    break;
}

var beneficiaryAccount = '0x38f388fadf4a6a35c61c3f88194ec5ae162c8944';

var web3 = new Web3(new Web3.providers.HttpProvider(url));
web3.eth.defaultAccount = profile.defaultAccount;

//  var c = contracts['LichterkettenMasterKontrollProgramm'].contract;
var abi = [{"constant":false,"inputs":[{"name":"b","type":"address"}],"name":"setBeneficiary","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"z","type":"uint256"}],"name":"operate","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"z","type":"uint256"},{"indexed":false,"name":"timespan","type":"uint256"}],"name":"Operated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"remainingTime","type":"uint256"}],"name":"Busy","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"}],"name":"BeneficiaryChanged","type":"event"}];
var c = web3.eth.contract(abi).at(profile.contractAddress);

var setLight = function(r,g,b) {
    console.log('Color set to: ' + r + " - " + g + " - " + b);
};

var watchEvent = c.Operated({}, {fromBlock: 0, toBlock: 'latest'});

watchEvent.watch(function(error, result) {
    if (error) {
        console.log('error occured: ' + error);
    } else {
        setLight(result.args.x, result.args.y, result.args.z);
      	console.log('light strip operated by ' + (result.args.who) + ': reservation was done for ' + (result.args.timespan) + ' seconds.');
  	    console.log('balance in beneficiary account: ' + web3.eth.getBalance(beneficiaryAccount));
    }
});
  
var watchEventBusy = c.Busy({}, {fromBlock: 0, toBlock: 'latest'});
watchEventBusy.watch(function(error, result) {
    if (error) {
        console.log('error occured: ' + error);
    } else {
      console.log('Light strip is busy for another ' + (result.args.remainingTime) + " seconds.");
    }
});

var watchEventBeneficiaryChanged = c.BeneficiaryChanged({}, {fromBlock: 0, toBlock: 'latest'});
watchEventBeneficiaryChanged.watch(function(error, result) {
    if (error) {
        console.log('error occured: '+ error);
    } else {
    	console.log('changed beneficiary: ' + result.args.receiver);
    }
});
