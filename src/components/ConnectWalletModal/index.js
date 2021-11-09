import React, { useState } from 'react'
import Modal from '../Modal';

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

import { db } from '../../utils/firebase';
import { BINANCE_SMART_CHAIN_NET_URL, web3 } from '../../App';
import { web3Utils } from 'web3-utils';

const abi = require("../../truffle_abis/Wallet.json").abi;
const contractAddress = "0xDde600a0A175FeA298b450a71E496e4606a3Dc0A"

const ConnectWallet = ({ show, setShow, setWallet }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const handleCreateWallet = async () => {
        setLoading(true)
        let foundUserWallet = null;
        // const web3 = new Web3(BINANCE_SMART_CHAIN_NET_URL);

        try {
            const q = query(collection(db, "wallets"), where("email", "==", email))
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => foundUserWallet = { id: doc.id, ...doc.data() });

            if (foundUserWallet === null) {
                const walletObject = web3.eth.accounts.create();
                const walletAddress = walletObject.address;
                const privateKey = walletObject.privateKey;
                // console.log('wallet object', walletObject)
                const encryptedKey = web3.eth.accounts.encrypt(privateKey, password)
                // console.log('encrypted key', encryptedKey)
                // const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
                web3.eth.accounts.wallet.add(walletObject);
                web3.eth.defaultAccount = walletObject.address;

                const userRef = await addDoc(collection(db, "wallets"), {
                    name: name,
                    email: email,
                    address: walletAddress,
                    encryptedKey: encryptedKey
                });

                localStorage.wallet = JSON.stringify({ name, walletAddress, email, password, encryptedKey })
                localStorage.loggedIn = true;
                localStorage.walletAddress = walletAddress;
                setWallet(localStorage.wallet)
                setError(null)
                handleClose()
            } else {
                //check the password and decrypt with web3
                try {
                    const decryptWallet = web3.eth.accounts.decrypt(foundUserWallet.encryptedKey, password)

                    web3.eth.accounts.wallet.add(decryptWallet);
                    web3.eth.defaultAccount = decryptWallet.address

                    localStorage.wallet = JSON.stringify({ name, walletAddress: decryptWallet.address, email, password, encryptedKey: foundUserWallet.encryptedKey })
                    localStorage.loggedIn = true;
                    localStorage.walletAddress = decryptWallet.address;

                    // initBNB(localStorage.walletAddress)

                    setWallet(localStorage.wallet)
                    setError(null)
                    console.log('wallet decrypted')
                    handleClose()
                } catch (e) {
                    setError("Invalid login attempt!")
                    console.log('Bad aempt')
                }
            }

            setLoading(false)
        } catch (e) {
            console.error("Error adding document: ", e);
        }

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
                {error && <div className="py-4 mx-auto flex justify-center">{error}</div>}
                <hr />
                <div className="container mx-auto">
                    <div className="py-12 px-12">
                        <div className="flex flex-col justify-center space-x-4 bg-dark">
                            <div className="flex flex-col">
                                <label>Name</label>
                                <input type="text" className="border border-dark p-3 rounded mb-4 " value={name} onChange={e => setName(e.target.value)} />
                                <label>Email Address</label>
                                <input type="email" className="border border-dark p-3 rounded mb-4 " value={email} onChange={e => setEmail(e.target.value)} />
                                <label>Password</label>
                                <input type="password" className="border border-dark p-3 mb-4 rounded" value={password} onChange={e => setPassword(e.target.value)} />
                                <button disabled={loading} onClick={handleCreateWallet} className="text-center bg-blue-600 rounded px-3 py-3 drop-shadow text-lg text-white cursor-pointer shadow-2xl mt-3">{loading ? `Connecting...` : `Sign in/Login`}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default ConnectWallet