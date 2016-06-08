//Sample contract
contract LichterkettenMasterKontrollProgramm {
	uint constant price = 10 finney;
	uint constant reservationTime = 20 seconds;
	
	address owner;
	address beneficiary;
	
	uint reservedUntil;
			
	event Operated(address who, uint x, uint y, uint z);
	event Busy(uint remainingTime);

	function LichterkettenMasterKontrollProgramm() {
		owner = msg.sender;
		reservedUntil = 0;
	}
	
	function setBeneficiary(address b) {
		// Reject non-owners to set the beneficiary
		if (msg.sender != owner)
			return;
		
		if (b == msg.sender) {
			beneficiary = 0;
		} else {
			beneficiary = b;
		}
	}
	
	function operate(uint x, uint y, uint z) {
		if (msg.value >= price) {
			uint timestamp = now;
			if (timestamp > reservedUntil) {
				address receiver = (beneficiary == 0) ? owner : beneficiary;
				receiver.send(msg.value);
				
				reservedUntil = now + reservationTime;
				
				Operated(msg.sender, x, y, z);
			} else {
				Busy(reservedUntil - timestamp);
				
				// Refund
				msg.sender.send(msg.value);
			}
		} else {
			throw;
		}
	}
	
	function() {
		throw;
	}
}