import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import ReservationModal from "./components/ReservationModal"
import TicketPaymentModal from "./components/TicketPaymentModal"
import { injected } from "./utils/connectors"

import Web3 from "web3"
import ConnectWallet from "./components/ConnectWalletModal"
import { web3Utils } from 'web3-utils';

export const BINANCE_SMART_CHAIN_NET_URL = process.env.NODE_ENV === "development" ?
  'https://speedy-nodes-nyc.moralis.io/e08fb68a1637d6b08550068d/bsc/testnet'
  : 'https://bsc-dataseed1.binance.org:443';

export const web3 = new Web3(new Web3.providers.HttpProvider(BINANCE_SMART_CHAIN_NET_URL));


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

  // async function connect() {
  //   try {
  //     await web3React.activate(injected)
  //     if (window.ethereum) {
  //       window.web3 = new Web3(new Web3.providers.HttpProvider(BINANCE_SMART_CHAIN_NET_URL));
  //       try {
  //         // ask user for permission
  //         await window.ethereum.enable();
  //         // user approved permission
  //       } catch (error) {
  //         // user rejected permission
  //         console.log('user rejected permission');
  //       }
  //     }
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

  // async function disconnect() {
  //   try {
  //     await web3React.deactivate()
  //     console.log('disconnected')
  //   } catch (ex) {
  //     console.log(ex)
  //   }
  // }

  function start_and_end(str) {
    if (str.length > 10) {
      return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
    }
    return str;
  }

  const handleSignOut = async () => {
    localStorage.removeItem("wallet")
    setWallet(null)
  }


  useEffect(() => {
    // connect()
    // console.log('account', web3React.account)
    // console.log('active', web3React.active)

    // console.log('eth', window.web3.eth)
    if (localStorage.wallet) {
      let obj = JSON.parse(localStorage.wallet)
      console.log('local storage', obj)
      setWallet(obj)
    }

  }, [localStorage.wallet])

  useEffect(() => {
    const getBalance = async () => {
      var bal = await web3.eth.getBalance(localStorage.walletAddress); //Will give value in.
    // bal = web3.toDecimal(bal);
    setBalance(bal)
  
    }
    getBalance()
  }, [])

  return (
    <>
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
                    <div>Bal: {balance} TDO </div>
                    <div className="flex justify-end">
                      <button className="py-1 px-4 rounded shadow-xl bg-blue-500 text-white text-sm" onClick={handleSignOut}>Sign Out</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {wallet !== null && <>
            <h2 className="text-5xl mt-40">Sample Payment Processor</h2>
            {/* {web3React.active ? (<div className="p-4">Connected with: {web3React.account}</div>) : <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect Wallet</button>} */}
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
    </>
  )
}

export default App