import React from 'react'

import { clientCoImg, clientImg } from '../../utils/constants'

const ClientCardText = ({clientData}) => (
    <>
        <div className='w-100 d-flex justify-content-center p-1' >
            <img 
            style={{maxWidth: '20rem', borderRadius: "5%"}}
            src={clientData.companyName === 'Private Individual' ? clientImg : clientCoImg } 
            />
        </div>
        <div className='container'>
            <h4 className='mt-2 text-center'>
                {clientData.companyName !== 'Private Individual' 
                ? clientData.companyName 
                : `${clientData.firstName} ${clientData.surnames}`
                }
            </h4>
            <hr/>
            <p>

                {clientData.companyName !== 'Private Individual' && (
                    `Name: ${clientData.firstName} ${clientData.surnames}, ${clientData.title}`
                )} <br/>
                Country: {clientData.country} <br/>
                Phone: {clientData.phone} <br/>
                Email: {clientData.email}
            </p>
        </div>
    </>
)

export default ClientCardText