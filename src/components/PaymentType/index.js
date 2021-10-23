import { useWeb3React } from "@web3-react/core"
import { useEffect, useState } from "react"
import ReservationModal from "./components/ReservationModal"
import TicketPaymentModal from "./components/TicketPaymentModal"
import { injected } from "./utils/connectors"

import Web3 from "web3"

const PaymentType = () => {
  const web3React = useWeb3React()

  const [showModal, setShowModal] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)

  const handleHotelReservation = () => setShowHotelModal(true)

  const handleTicketPurchase = () => {
    setShowModal(true)
   }

   async function connect() {
     try{
      await web3React.activate(injected)
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            // ask user for permission
            await window.ethereum.enable();
            // user approved permission
        } catch (error) {
            // user rejected permission
            console.log('user rejected permission');
        }
    }
     }catch(ex){
       console.log(ex)
     }
   }

   async function disconnect(){
     try{
      await web3React.deactivate()
      console.log('disconnected')
     }catch(ex){
       console.log(ex)
     }
   }

 
   useEffect(() => {
    connect()
    console.log('account', web3React.account)
    console.log('active', web3React.active)

    console.log('eth', window.web3.eth)
    
   }, [])

  return (
    <>
      <div className="container mx-auto">
        <div className="py-12 px-12">
          <h2 className="text-5xl mt-40">Sample Payment Processor</h2>
          {web3React.active ? (<div className="p-4">Connected with: {web3React.account}</div>) : <button onClick={connect} className="py-2 mt-20 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Connect Wallet</button>}
          <div className="flex justify-center space-x-4 mt-12 ">
            <div onClick={handleHotelReservation} className="w-3/6 text-center bg-green-500 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Hotel Reservation</div>
            <div onClick={handleTicketPurchase} className="w-3/6 text-center bg-blue-600 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Ticket Purchase (40 TDO)</div>
          </div>
        </div>
      </div>
      <TicketPaymentModal show={showModal} setShow={setShowModal} data={{price: 40}} />
      <ReservationModal show={showHotelModal} setShow={setShowHotelModal} isHotel={false} />
    </>
  )
}

export default PaymentType