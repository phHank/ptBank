import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { UPLOAD_DOC_MUTATION } from './AddClientForm'
import { GET_CLIENTS_QUERY } from './ClientList'

import Card from 'react-bootstrap/Card'

import DeleteClientCard from './DeleteClientCard' 
import Loading from '../Loading'
import FileInput from '../forms/FileInput'

import { clientCoImg, clientImg, linkStyle } from '../../utils/constants'
import { getDateTime } from '../../utils/helpers'

const ClientCard = ({clientData, setEdit, g3}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [formFile, setFormFile] = useState(null)
    const [error, setError] = useState('')
    const [showUpload, setShowUpload] = useState(false)

    const [uploadFile, {loading}] = useMutation(UPLOAD_DOC_MUTATION, {
        update: (cache, {data: {upload: {client: {incorpCert}}}}) => {
            const { clients } = cache.readQuery({
              query: GET_CLIENTS_QUERY,
              variables: {clientId: clientData.id}
            })
  
            cache.writeQuery({
              query: GET_CLIENTS_QUERY,
              variables: {clientId: clientData.id},
              data: {
                clients: [{
                    ...clients,
                    incorpCert
                }]
              }
            })
        },
        onError: error => {
          setError(error)
        }
    })

    if (loading) return <Loading /> 

    return (
        <Card bg='dark' text='light' className='m-5'>
            {error && <div className='error-message'>Error uploading file: {error.message}</div>}
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

                {/* TODO: create component */}
                <div className={`d-flex flex-${showUpload ? 'column' : 'row'} align-items-center`}>
                    {clientData.incorpCert && (
                        <a href={`http://localhost:8080/media/${clientData.incorpCert}`} style={linkStyle} target='_blank'>
                            Certificate of Incorporation
                        </a>)
                    }
                    
                    {!showUpload && (<p className='btn text-light' onClick={() => setShowUpload(!showUpload)}>&#43;</p>)}

                    {showUpload && (
                        <div className='block d-flex flex-row my-5'>
                            <FileInput setFile={setFormFile} />
                            {formFile && (
                                <button 
                                  className='btn btn-sm btn-light m-2 h-25'
                                  onClick={() => {
                                    uploadFile({variables: {
                                        clientId: clientData.id,
                                        file: formFile
                                    }
                                    })
                                    setShowUpload(false)
                                  }}
                                >
                                    Upload
                                </button>)
                            }
                        </div>)
                    }
                </div>

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