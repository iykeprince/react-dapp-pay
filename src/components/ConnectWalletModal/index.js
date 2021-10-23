import React from 'react'
import Modal from '../Modal';

var Web3 = require('web3');

const ConnectWallet = ({ show, setShow}) => {

    const handleCreateWallet = () => {
        const web3 = new Web3('https://speedy-nodes-nyc.moralis.io/e08fb68a1637d6b08550068d/bsc/testnet');

        const encryptedAccount = web3.eth.accounts.create().encrypt('');
    }

    const handleClose = () => {
        setShow(false)
    }


    return (
        <Modal show={show}>
            <div className="w-2/5 bg-white shadow-2xl mx-auto rounded-lg ">
                <div className="flex justify-between pr-5">
                    <h3 className="text-3xl font-semibold p-5 text-yellow-600">
                        Connect Wallet
                    </h3>
                    <button onClick={handleClose}>
                        <span className="text-4xl">&times;</span>
                    </button>
                </div>
                <hr />
                <div className="container mx-auto">
                    <div className="py-12 px-12">
                        <div className="flex flex-col justify-center space-x-4 mt-12 ">
                            <div>
                                <input type="email" className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                            </div>
                            <div>
                                <input type="password" className="border border-transparent focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                            </div>
                            <div onClick={handleCreateWallet} className="w-3/6 text-center bg-blue-600 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl mt-2">Sign in/Login</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ConnectWallet