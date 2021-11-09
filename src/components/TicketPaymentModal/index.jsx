import React, { useState, useContext } from 'react'
import { useWeb3React } from '@web3-react/core'

import { randomBytes } from 'crypto'
import web3Utils from 'web3-utils'
import { web3 } from '../../App'
import AppContext from '../../context/AppContext'

const TOKEN_CONTRACT_ADDRESS = process.env.REACT_APP_TOKEN_CONTRACT_ADDRESS
const paymentContractAddress = '0x98FA79a1BdE57cEcCD92df910f2E6fF81f0cE617'

const abi = require('../../truffle_abis/Payment.json').abi
const ierc20Abi = require('../../truffle_abis/IERC20.json').abi

const TicketPaymentModal = ({ show, setShow, data, isHotel }) => {
  const { account, active, activate } = useWeb3React()
 
  const { getBalance } = useContext(AppContext)

  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(true)
  const [isError, setIsError] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    const amount = parseInt(data.price)

    var weiAmount = web3Utils.toWei(web3Utils.toBN(amount))

    const txRef = web3Utils.randomHex(32)

    try {
      const walletTo = TOKEN_CONTRACT_ADDRESS
      const walletFrom = localStorage.walletAddress

      const contract = new web3.eth.Contract(ierc20Abi, TOKEN_CONTRACT_ADDRESS)

      const gas = await contract.methods
        .transfer('0x3077ce0A36e7CF748EeaCEd6eba156f1E360FE21', weiAmount)
        .estimateGas({ from: walletFrom })

      const tx = await contract.methods
        .transfer('0x3077ce0A36e7CF748EeaCEd6eba156f1E360FE21', weiAmount)
        .send({ from: walletFrom, gas: gas, gasPrice: 10 * 10 ** 9 })

      console.log('Transaction will notify after success')
      console.log('tx', tx)

      // let event = contractInstance.event()
      // event.watch(callback)

      setLoading(false)
      setSuccess(true)
      setPending(false)
      setIsError(false)
      setTimeout(() => handleClose(), 2000)
    } catch (ex) {
      console.log(ex)

      setPending(false)
      setSuccess(false)
      setLoading(false)
      setIsError(true)
    }
  }

  const handleClose = () => {
    setShow(false)
    setSuccess(false)
    setIsError(false)
    setPending(true)
    getBalance()
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
        
        {data !== null && !isHotel && (
          <div className="pt-5 flex justify-center">
            <h4 className="font-bold text-4xl">40 TDO</h4>
          </div>
        )}
        {data !== null && isHotel && (
          <div className="p-2 flex flex-column justify-center">
            <h4 className="font-bold">
              ${data.price} ~ {data.price / 10} TDO
            </h4>
          </div>
        )}
        <div className="p-5 flex justify-center">
          {/* {!success && <img src={qrCode} className="w-36 h-36" onClick={() => setSuccess(true)} />} */}
          {pending && (
            <img
              src={`https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${TOKEN_CONTRACT_ADDRESS}&choe=UTF-8`}
              className="w-36 h-36"
              // onClick={() => setSuccess(true)}
            />
          )}
          {success && (
            <i
              className="fa fa-check text-9xl text-green-400"
              onClick={() => setSuccess(false)}
            ></i>
          )}
          {isError && (
            <div className="flex flex-col justify-center">
              <div className="text-center">
                <i className="fa fa-times text-9xl text-red-400"></i>
              </div>
              <br />
              <p className="p-2 text-center text-xl">
                An error occured, Please check your TDO balance
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-center">
          {success && (
            <p className="pb-5 text-2xl text-green-400">
              Transaction successful
            </p>
          )}
        </div>
       
        <div className="flex justify-center align-center py-3">
          {!success && !isError && (
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
