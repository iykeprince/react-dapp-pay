import React from 'react'

const Modal = ({ children, show }) => {
    
    return (
        <div
      className={`fixed pt-40 top-0 left-0 right-0 bottom-0 bg-blue-100 bg-opacity-50 ${
        !show ? 'hidden' : ''
      }`}
    >
        {children}
    </div>
    )
}

export default Modal