import React from 'react'

const Footer = () => (
    <div className='fixed-bottom bg-dark w-100' style={{opacity: ".5"}}>
        <span className='text-light'>&copy; Philip Hankey {new Date().getFullYear()}</span>
    </div>
)

export default Footer