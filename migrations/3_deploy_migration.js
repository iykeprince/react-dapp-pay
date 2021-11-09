const Payment = artifacts.require('Payment')
const Wallet = artifacts.require('Wallet')

module.exports = async function(deployer) {
    const contractAddress = "0xee31650923086260256b797658e2b8b189bd268d"
    await deployer.deploy(Payment, contractAddress);
    const payment =  await Payment.deployed("0xee31650923086260256b797658e2b8b189bd268d")
    console.log('payment contract deployed', payment.address)
    // await deployer.deploy(Wallet, contractAddress)
}