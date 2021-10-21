import React from 'react'
import qrCode from './qrcode.png'
import { useState } from 'react';

const TicketPaymentModal = ({ show, setShow }) => {
    const [success, setSuccess] = useState(false)



  return (
    <div className={`fixed pt-40 top-0 left-0 right-0 bottom-0 bg-blue-100 bg-opacity-50 ${!show ? 'hidden' : ''}`}>
      <div className="w-2/5 bg-white shadow-2xl mx-auto rounded-lg ">
        <div className="flex justify-between pr-5">
          <h3 className="text-3xl font-semibold p-5">Tido Pay</h3>
          <button onClick={() => setShow(false)}>Close</button>
        </div>
        <hr />
        <div class="flex justify-between px-5">
          <p>
            <i className="fa fa-spin fa-spinner"></i> Awaiting payment
          </p>
          <p>1:40:04</p>
        </div>
        <div className="p-2 flex justify-center">
          <h4 className="font-bold">40 TDO</h4>
        </div>
        <div className="p-5 flex justify-center">
          {!success && <img src={qrCode} className="w-36 h-36" onClick={() => setSuccess(true)} />}
          {success && <i className="fa fa-check text-9xl text-green-400" onClick={() => setSuccess(false) } ></i>}
         
        </div>
        <div className="flex justify-center">
        {success && <p className="pb-5 text-2xl text-green-400">Transaction successful</p>}
        </div>
       {!success && <div className="p-2 flex justify-center items-center border-solid rounded border-gray-500 pb-5">
          <h4 className="font-normal">0xasdlfj9023poadkfjlaejqiejojelakjdsfpioqjeiqjekf</h4>&nbsp;
          <span className="cursor-pointer"><i className="fa fa-copy"></i></span>
        </div>}
      </div>
    </div>
  )
}

export default TicketPaymentModal
