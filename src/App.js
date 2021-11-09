import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import ReservationModal from "./components/ReservationModal"
import TicketPaymentModal from "./components/TicketPaymentModal"
import { injected } from "./utils/connectors"

import Web3 from "web3"
import ConnectWallet from "./components/ConnectWalletModal"
import web3Utils from 'web3-utils'
import { AppContextProvider } from "./context/AppContext"

export const BINANCE_SMART_CHAIN_NET_URL = process.env.NODE_ENV === "development" ?
  'https://speedy-nodes-nyc.moralis.io/e08fb68a1637d6b08550068d/bsc/testnet'
  : 'https://bsc-dataseed1.binance.org:443';

/**test */
const tokenABI = require('./truffle_abis/IERC20.json').abi
const TOKEN_CONTRACT_ADDRESS = '0xee31650923086260256b797658e2b8b189bd268d'
/**TEST */

export const web3 = new Web3(new Web3.providers.HttpProvider(BINANCE_SMART_CHAIN_NET_URL));

export const initBNB = async (userWalletAddress) => {
  const BNB_Balance = await web3.eth.getBalance(userWalletAddress);
  console.log('bNB BALANCE', BNB_Balance)
  const result = web3.utils.fromWei(BNB_Balance, "ether")

  const nonce = await web3.eth.getTransactionCount("0x3077ce0A36e7CF748EeaCEd6eba156f1E360FE21", 'latest'); // nonce starts counting from 0 with my own address o!

  const transaction = {
    'to': userWalletAddress, // faucet address to return eth
    'value': 0.005,
    'gas': 30000,
    'maxFeePerGas': 1000000108,
    'nonce': nonce,
    // optional data field to send message or execute smart contract
  };

  const PRIVATE_KEY = process.env.PRIVATE_KEY;
  const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);

  web3.eth.sendSignedTransaction(signedTx.rawTransaction, function (error, hash) {
    if (!error) {
      console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
    } else {
      console.log("❗Something went wrong while submitting your transaction:", error)
    }
  });

}

const App = () => {

  const web3React = useWeb3React()

  const [showModal, setShowModal] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false)
  const [balance, setBalance] = useState(0)

  const [wallet, setWallet] = useState(null)

  const handleHotelReservation = () => setShowHotelModal(true)

  const handleTicketPurchase = () => {
    setShowModal(true)
  }


  function start_and_end(str) {
    if (str.length && str.length > 10) {
      return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
    }
    return str;
  }

  const handleSignOut = async () => {
    localStorage.clear()
    setWallet(null)
  }


  useEffect(() => {
    if (localStorage.wallet) {
      let obj = JSON.parse(localStorage.wallet)

      console.log('obj', obj)
      const decryptWallet = web3.eth.accounts.decrypt(obj.encryptedKey, obj.password)

      web3.eth.accounts.wallet.add(decryptWallet);
      web3.eth.defaultAccount = decryptWallet.address
      console.log('decryption happend', web3.eth.defaultAccount)
      setWallet(obj)

      initBNB(decryptWallet.address)
      getBalance()
    }

  }, [localStorage.wallet])



  const getBalance = async () => {

    var tokenInst = new web3.eth.Contract(tokenABI, TOKEN_CONTRACT_ADDRESS);
    tokenInst.methods.balanceOf(localStorage.walletAddress).call().then(function (bal) {
      console.log(bal);
      setBalance(bal)
    })
  }

  const formatToEthers = (amount) => {
    var ethAmount = web3Utils.fromWei(web3Utils.toBN(amount))
    return ethAmount
  }

  return (
    <AppContextProvider value={{
      getBalance 
    }}>
      <div className="container mx-auto">
        <div className="py-12 px-12">
          <div className="flex justify-center">
            {wallet === null ? (<div className="flex flex-col justify-center">
              <h3 className="text-center text-4xl mb-5">Welcome to Tidos</h3>
              <div className="text-center"><button onClick={() => setShowConnectWalletModal(true)} className="text-center bg-green-500 rounded px-4 py-2 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Create Tido Wallet</button></div>
            </div>) : (
              <div className="p-4 shadow-xl self-start rounded-sm">
                <div className="flex justify-start">
                  <div className="m-2">
                    <img src="https://source.unsplash.com/40x40" className="rounded-full" />
                  </div>
                  <div className="flex flex-col justify-center ml-4">
                    <h4>{wallet.name}</h4>
                    <div>{wallet.walletAddress}</div>
                    <div>Bal: {formatToEthers(balance)} TDO </div>
                    <div className="flex justify-end">
                      <button className="py-1 px-4 rounded shadow-xl bg-blue-500 text-white text-sm" onClick={handleSignOut}>Sign Out</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {wallet !== null && <>
            <h2 className="text-5xl mt-40">Tidos Payment Processor</h2>
            <div className="flex justify-center space-x-4 mt-12 ">
              <div onClick={handleHotelReservation} className="w-3/6 text-center bg-green-500 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Hotel Reservation</div>
              <div onClick={handleTicketPurchase} className="w-3/6 text-center bg-blue-600 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Ticket Purchase (40 TDO)</div>
            </div>
          </>}

        </div>
      </div>
      <TicketPaymentModal show={showModal} setShow={setShowModal} data={{ price: 40 }} />
      <ReservationModal show={showHotelModal} setShow={setShowHotelModal} isHotel={false} />
      <ConnectWallet show={showConnectWalletModal} setShow={setShowConnectWalletModal} setWallet={setWallet} />
    </AppContextProvider>
  )
}

export default App