import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'

import DeleteClientCard from './DeleteClientCard' 

import { clientCoImg, clientImg } from '../../utils/constants'
import { getDateTime } from '../../utils/helpers'

const ClientCard = ({clientData, setEdit, g3}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)

    return (
        <Card bg='dark' text='light' className='m-5'>
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
                        `Name: ${clientData.firstName} ${clientData.surnames}\n
                        (Title: ${clientData.title})\n`
                    )} <br/>
                    Country: {clientData.country} <br/>
                    Phone: {clientData.phone} <br/>
                    Email: {clientData.email}
                </p>
                {confirmDelete && (<DeleteClientCard setConfirmDelete={setConfirmDelete} clientId={clientData.id} />)}
                {g3 && (
                    <div className='d-flex w-100 justify-content-end center'>
                        <button 
                          className='btn btn-sm btn-light mx-1'
                          onClick={() => {
                              setConfirmDelete(false)
                              setEdit(true)
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className='btn btn-sm btn-danger'
                          onClick={() => setConfirmDelete(true)}
                        >
                          Delete
                        </button>
                    </div>
                )}
            </div>
            <div className='d-flex justify-content-center pt-1 mt-1 border-top border-secondary'>
                <small className='text-muted'>
                    Last updated {getDateTime(new Date(clientData.lastUpdated))} by {clientData.updatedBy.username}.
                </small>
            </div>
        </Card>
    )
}

export default ClientCard