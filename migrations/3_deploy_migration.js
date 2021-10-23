const Payment = artifacts.require('Payment')

module.exports = async function(deployer) {
    await deployer.deploy(Payment, "0xee31650923086260256b797658e2b8b189bd268d");
    // const payment =  await Payment.deployed("0xee31650923086260256b797658e2b8b189bd268d")
    // console.log('payment contract deployed', payment.address)
}