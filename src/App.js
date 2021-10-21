import { useState } from "react"
import TicketPaymentModal from "./components/TicketPaymentModal"

const App = () => {
  const [showModal, setShowModal] = useState(false)

  const handleHotelReservation = () => { }

  const handleTicketPurchase = () => {
    setShowModal(true)
   }

  return (
    <>
      <div className="container mx-auto">
        <div className="py-12 px-12">
          <h2 className="text-5xl mt-40">Sample Payment Processor</h2>
          <div className="flex justify-center space-x-4 mt-12 ">
            <div onClick={handleHotelReservation} className="w-3/6 text-center bg-green-500 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Hotel Reservation</div>
            <div onClick={handleTicketPurchase} className="w-3/6 text-center bg-blue-600 rounded-lg px-6 py-6 drop-shadow text-lg text-white cursor-pointer shadow-2xl">Ticket Purchase (40 TDO)</div>
          </div>
        </div>
      </div>
      <TicketPaymentModal show={showModal} setShow={setShowModal} />
    </>
  )
}

export default App