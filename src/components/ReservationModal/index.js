import React, {useState} from 'react';
import TicketPaymentModal from '../TicketPaymentModal';

import { HOTEL_DATA } from './data'

const ReservationModal = ({ show, setShow }) => {
    const [showModal, setShowModal] = useState(false)
    const [data, setData] = useState(null)

    const handleRequestBooking = (data) => {
        setData(data)
        setShowModal(true)
        //close the hotel modal
        setShow(false)
    }

    return (
        <>
        <div className={`fixed overflow-y-scroll pb-5 pt-40 top-0 left-0 right-0 bottom-0 bg-blue-100 bg-opacity-50 ${!show ? 'hidden' : ''}`}>
            <div className="w-1/2 bg-white shadow-2xl mx-auto rounded-lg ">
                <div className="flex justify-between pr-5">
                    <h3 className="text-3xl font-semibold p-5">Hotels</h3>
                    <button onClick={() => setShow(false)}><span className="text-4xl">&times;</span></button>
                </div>
                <hr />
                {HOTEL_DATA.map((data, index) => (<div key={index} className="flex flex-row justify-start p-4 ml-4 mr-4 mb-4 border rounded border-gray-300 border-solid">
                    <div className="w-40 h-40 border rounded border-grey-400 border-solid">
                        <img src={data.image} className="rounded" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div className="ml-2">
                        <p className="mb-2"><span className="py-3 black-text text-sm font-semibold">{data.location}</span></p>
                        <p className="text-base font-normal">{data.name}</p>
                        <div className="flex justify-start gap-y-0.5">Reviews {data.reviews.counts}</div>
                        <div className="gap-y-1"></div>
                        <div className="flex justify-between">
                            <div className="text-xl text-black "><span>${data.price}</span></div>
                        </div>
                        <div className="mt-3"><button onClick={() => handleRequestBooking(data)} className="py-2 px-4 bg-green-400 text-white shadow-xl rounded ">Request booking</button></div>
                    </div>
                </div>))}

            </div>
        </div>
        <TicketPaymentModal show={showModal} setShow={setShowModal} data={data} isHotel={true} />
        </>
    )
}

export default ReservationModal