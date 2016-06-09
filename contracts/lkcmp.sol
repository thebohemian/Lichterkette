//Sample contract
contract LichterkettenMasterKontrollProgramm {
	uint constant price = 10 finney;
	uint constant reservationTime = 10 seconds;
	
	address owner;
	address beneficiary;
	
	uint reservedUntil;
			
	event Operated(address who, uint x, uint y, uint z, uint timespan);
	event Busy(uint remainingTime);
	event BeneficiaryChanged(address receiver);

	function LichterkettenMasterKontrollProgramm() {
		owner = msg.sender;
		reservedUntil = 0;
	}
	
	function setBeneficiary(address b) {
		// Reject non-owners to set the beneficiary
		if (msg.sender != owner) {
			throw;
		}
		
		if (b == msg.sender) {
			beneficiary = 0;
		} else {
			beneficiary = b;
		}
		BeneficiaryChanged((beneficiary == 0) ? owner : beneficiary);
	}
	
	function operate(uint x, uint y, uint z) {
		if (msg.value >= price) {
			uint timestamp = now;
			if (timestamp > reservedUntil) {
				address receiver = (beneficiary == 0) ? owner : beneficiary;
				receiver.send(msg.value);
				
				uint value = msg.value;
				uint time = 0;
				while (value >= price) {
					time += reservationTime;
					value -= price;
				}
				
				reservedUntil = now + time;
				
				Operated(msg.sender, x, y, z, time);
				
				// Send unused money back
				if (value > 0) {
					msg.sender.send(value);
				}
			} else {
				Busy(reservedUntil - timestamp);
				
				// Refund
				msg.sender.send(msg.value);
			}
		} else {
			throw;
		}
	}
	
	function kill() {
		if (msg.sender == owner) {
			suicide(msg.sender);
		}
	}
	
	function() {
		throw;
	}
}