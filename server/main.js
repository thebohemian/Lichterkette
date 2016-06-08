var Web3 = require('web3');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("./server/config.json", "utf8"));

var sandboxId = config.sandboxId;
var hostname = config.hostname;

var url = 'https://' + hostname + ':8555/sandbox/' + sandboxId;
var web3 = new Web3(new Web3.providers.HttpProvider(url));

web3.eth.defaultAccount = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

//  var c = contracts['LichterkettenMasterKontrollProgramm'].contract;
var abi = [{"constant":false,"inputs":[{"name":"b","type":"address"}],"name":"setBeneficiary","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"y","type":"uint256"},{"name":"z","type":"uint256"}],"name":"operate","outputs":[],"type":"function"},{"inputs":[],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"who","type":"address"},{"indexed":false,"name":"x","type":"uint256"},{"indexed":false,"name":"y","type":"uint256"},{"indexed":false,"name":"z","type":"uint256"}],"name":"Operated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"remainingTime","type":"uint256"}],"name":"Busy","type":"event"}];
var c = web3.eth.contract(abi).at('0x17956ba5f4291844bc25aedb27e69bc11b5bda39');

var setLight = function(r,g,b) {
    console.log('Color set to: ' + r + " - " + g + " - " + b);
};

var watchEvent = c.Operated({}, {fromBlock: 0, toBlock: 'latest'});

watchEvent.watch(function(error, result) {
    if (error) {
        console.log('error occured: ' + error);
    } else {
        setLight(result.args.x, result.args.y, result.args.z);
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