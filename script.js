const ABI = {
	Compound: [
		{
			"constant": true,
			"inputs": [
				{
					"name": "_address",
					"type": "address"
				}
			],
			"name": "checkMembership",
			"outputs": [
				{
					"name": "",
					"type": "bool"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	],
	Aave: [
		{
			"constant": true,
			"inputs": [
				{
					"name": "user",
					"type": "address"
				}
			],
			"name": "getUserAccountData",
			"outputs": [
				{
					"components": [
						{
							"name": "totalCollateralETH",
							"type": "uint256"
						},
						{
							"name": "totalDebtETH",
							"type": "uint256"
						},
						{
							"name": "availableBorrowsETH",
							"type": "uint256"
						},
						{
							"name": "currentLiquidationThreshold",
							"type": "uint256"
						},
						{
							"name": "ltv",
							"type": "uint256"
						},
						{
							"name": "healthFactor",
							"type": "uint256"
						}
					],
					"name": "",
					"type": "tuple"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	],
	Uniswap: [
		{
			"constant": true,
			"inputs": [
				{
					"name": "_user",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	],
	Balancer: [
		{
			"constant": true,
			"inputs": [
				{
					"name": "_address",
					"type": "address"
				}
			],
			"name": "balanceOf",
			"outputs": [
				{
					"name": "",
					"type": "uint256"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	]
};

const contractAddresses = {
	Compound: "0xc00e94cb662c3520282e6f5717214004a7f26888",
	Aave: "0x398ec7346dcd622edc5ae82352f02be94c62d119",
	Uniswap: "0xc0a47dfe034b400b47bdad5fecda2621de6c4d95",
	Balancer: "0xba12222222228d8ba445958a75a0704d566bf2c8"
};

const web3 = new Web3(Web3.givenProvider);

const protocols = ["Compound", "Aave", "Uniswap", "Balancer"];

async function getProtocols(address) {
    const results = {};
    
    for (let i = 0; i < protocols.length; i++) {
    const protocolName = protocols[i];
    const contractAddress = contractAddresses[protocolName];
    const contract = new web3.eth.Contract(ABI[protocolName], contractAddress);

    try {
        let response;
        if (protocolName === "Uniswap" || protocolName === "Balancer") {
          response = await contract.methods.balanceOf(address).call();
        } else {
          response = await contract.methods.checkMembership(address).call();
        }
      
        results[protocolName] = response ? "True" : "False";
      } catch (e) {
        results[protocolName] = "Error";
      }
    }

    return results;
    }
    
    async function handleCheck() {
    const addressList = document.getElementById("address-list");
    const resultTable = document.getElementById("result-table");
    resultTable.innerHTML = "";
    
    const addresses = addressList.value.split(",").map((addr) => addr.trim());
    
    for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    
    if (!Web3.utils.isAddress(address)) {
        continue;
      }
      
      const result = await getProtocols(address);
      
      const tableRow = document.createElement("tr");
      const addressCell = document.createElement("td");
      addressCell.innerText = address;
      tableRow.appendChild(addressCell);
      
      for (let j = 0; j < protocols.length; j++) {
        const protocolName = protocols[j];
        const protocolCell = document.createElement("td");
        protocolCell.innerText = result[protocolName] || "N/A";
        tableRow.appendChild(protocolCell);
      }
      
      resultTable.appendChild(tableRow);
    }
}

document.getElementById("check-button").addEventListener("click", handleCheck);      