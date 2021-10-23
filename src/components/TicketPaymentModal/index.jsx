import React from 'react'
import qrCode from './qrcode.png'
import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import { randomBytes } from 'crypto'
import web3Utils from 'web3-utils'

// 0xee31650923086260256b797658e2b8b189bd268d
const TOKEN_CONTRACT_ADDRESS = '0xee31650923086260256b797658e2b8b189bd268d'
const contractAddress = '0x98FA79a1BdE57cEcCD92df910f2E6fF81f0cE617'

const TicketPaymentModal = ({ show, setShow, data, isHotel }) => {
  const { account, active, activate } = useWeb3React()
  /**
   * Playground
   */

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    const amount = data.price;
        
    // console.log('amount', amount)
    // var weiAmount = 40;
    var weiAmount = web3Utils.toWei(
      web3Utils.toBN(amount)
      );
    
    const txRef = web3Utils.randomHex(32);

    const abi = require('../../truffle_abis/Payment.json').abi
    const ierc20Abi = require('../../truffle_abis/IERC20.json').abi

    try{
      const ierc20Contract = new window.web3.eth.Contract(
        ierc20Abi,
        TOKEN_CONTRACT_ADDRESS,
      )
  
      await ierc20Contract.methods
        .approve(contractAddress, weiAmount)
        .send({ from: account })
  
      const contract = new window.web3.eth.Contract(abi, contractAddress)
      const tx = await contract.methods
        .deposit(txRef, weiAmount, TOKEN_CONTRACT_ADDRESS)
        .send({ from: account })
  
      console.log('Transaction will notify after success')
      setLoading(false)
      setSuccess(true)
      setTimeout(() => handleClose(), 2000)
    }catch(ex){
      console.log(ex)
      setSuccess(false)
      setLoading(false)
    }
  }

  const handleClose = () => {
    setShow(false)
    setSuccess(false)
  }

  return (
    <div
      className={`fixed pt-40 top-0 left-0 right-0 bottom-0 bg-blue-100 bg-opacity-50 ${
        !show ? 'hidden' : ''
      }`}
    >
      <div className="w-2/5 bg-white shadow-2xl mx-auto rounded-lg ">
        <div className="flex justify-between pr-5">
          <h3 className="text-3xl font-semibold p-5 text-yellow-600">
            TidoPay
          </h3>
          <button onClick={handleClose}>
            <span className="text-4xl">&times;</span>
          </button>
        </div>
        <hr />
        <div class="flex justify-between px-5 mt-2 mb-2">
          <p>
            {active ? <span>✅ Connected</span> : <span>Disconnected</span>}
          </p>
          {!active && (
            <button className="py-2 px-5 shadow-xl rounded bg-blue-500 text-white">
              Connect Wallet
            </button>
          )}
        </div>
        {data !== null && !isHotel && (
          <div className="p-2 flex justify-center">
            <h4 className="font-bold text-4xl">40 TDO</h4>
          </div>
        ) }
        {data !== null && isHotel && (
          <div className="p-2 flex flex-column justify-center">
            <h4 className="font-bold">
              ${data.price} ~ {data.price / 10} TDO
            </h4>
          </div>
        )}
        {/* <div className="p-5 flex justify-center">
          {!success && <img src={qrCode} className="w-36 h-36" onClick={() => setSuccess(true)} />}
           {!success && <img src={qrCode} className="w-36 h-36" onClick={() => setSuccess(true)} />}
          {success && <i className="fa fa-check text-9xl text-green-400" onClick={() => setSuccess(false) } ></i>}
         
        </div> */}
        <div className="flex justify-center">
          {success && (
            <p className="pb-5 text-2xl text-green-400">
              Transaction successful
            </p>
          )}
        </div>
        {/* {!success && <div className="p-2 flex justify-center items-center border-solid rounded border-gray-500 pb-5">
          <h4 className="font-normal">0xasdlfj9023poadkfjlaejqiejojelakjdsfpioqjeiqjekf</h4>&nbsp;
          <span className="cursor-pointer"><i className="fa fa-copy"></i></span>
        </div>} */}
        <div className="flex justify-center align-center py-3">
          {!success && (
            <button
              disabled={loading}
              onClick={handlePay}
              className="py-2 px-5 shadow-xl rounded bg-green-500 text-white"
            >
              {loading ? (
                <span>
                  <i className="fa fa-spin fa-spinner"></i> Please wait...
                </span>
              ) : (
                <span>Proceed to pay</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TicketPaymentModal
