Lichterkette*:

This is a simple demonstration of a DApp written for the Ethereum network in Solidity (contract) and JavaScript/HTML.

What does it do?
----------------

The dapp demonstrates how you would connect a programmable electrical LED light strip to the Ethereum network. The idea is that
people can 'rent' the light strip for a certain duration and set the color value that the strip is showing. This is done by sending
a small amount of money to a smart contract.

The owner of the lightstrip needs to deploy the contract on the network and will become the owner of the contract instance itself, too.
This role grants him special rights: All income from the light strip usage is sent to his address. Additionally the owner can set
another address which then receives the payments. Last but not least, the owner can remove the contract from the blockchain.

How is it done?
---------------
The mechanics of the renting process are coded in a smart contract which is programmed in Ethereum's native language Solidity. The
contract file is in 'contracts/lkcmp.sol'. The contract includes a few functions which can be accessed through transactions.
Namely 'setBeneficiary' and 'operate'. The former will only change the payment address if the sender of the transactions is the
owner of the contract instance.
The 'operate' function is available to every network participant but requires a minimum amount of money and the light strip needs
to be detected as free. If both conditions are met it calculates the reservation time (10 finney equals 10 seconds) and emits
the 'Operated' event. Remaining unused money is sent back to the sender.

How are the contract function used?
-----------------------------------

public side: index.html
-----------------------
The project contains the HTML page 'web/index.html' which is supposed to be the public facing side of the lightstrip service. It
connects to the contract on the blockchain and allows sending the money. It offers HTML controls which provide the means to set the
color of the lightstrip and the amount of money to be send.

For demonstration purposes this HTML file also handles the contract events and shows the last set color. It also conveniently
displays an error message when the lightstrip was busy.

private side: output.html
-------------------------
The HTML page 'web/output.html' is supposedly a private page which show only shows the operations being run on the smart contract.
Apart from the events it tracks the balance of the beneficiary address and as such displays the income generated from renting
the lightstrip.

The output.html page is part of the normal web folder (where it isn't private at all) for historical and convenience reasons. A
proper private implementation would run on a separate server. This is done through a Node.JS subproject.

private side: server/main.js
----------------------------
A variant of the functionality of 'web/output.html' as a proper Node.JS project can be found in the 'server' folder. This program
simply prints all of the events associated with the smart contract. In a real scenario this program could would host the code which
interacts with the actual lightstrip.

You need to your sandboxId in the source files:
 - web/src/app-output.js
 - web/src/app.js
 - server/config.json

You can find id of your running sandbox on the sandbox panel.

[Re-]Building the web client:
```
$ npm install gulp-cli -g
$ npm install
$ gulp
```

Testing:
```
$ gulp test
```

Running:
```
$ cd web
$ npm start
```

Running the Node.JS server:
```
$ cd web
$ npm run start-server
```

* light strip in German

