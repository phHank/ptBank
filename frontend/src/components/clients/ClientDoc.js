import React, { useState } from 'react'
import { useMutation } from '@apollo/client'

import { CLIENT_UPLOAD_DOC_MUTATION } from './AddClientForm'
import { GET_CLIENTS_QUERY } from './ClientList'

import Loading from '../Loading'
import FileInput from '../forms/FileInput'

import { linkStyle } from '../../utils/constants'


const ClientDoc = ({clientId, incorpCert}) => {
    const [formFile, setFormFile] = useState(null)
    const [showUpload, setShowUpload] = useState(false)
    const [error, setError] = useState('')

    const [uploadFile, {loading}] = useMutation(CLIENT_UPLOAD_DOC_MUTATION, {
        update: (cache, {data: {clientUpload: {client: {incorpCert}}}}) => {
            const { clients } = cache.readQuery({
              query: GET_CLIENTS_QUERY,
              variables: {clientId: clientId}
            })
  
            cache.writeQuery({
              query: GET_CLIENTS_QUERY,
              variables: {clientId},
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
        <div className={`d-flex flex-${showUpload ? 'column' : 'row'} align-items-center`}>
            {error && <div className='error-message'>Error uploading file: {error.message}</div>}
            {incorpCert && (
                <a href={`http://localhost:8000/media/${incorpCert}`} style={linkStyle} target='_blank'>
                    Certificate of Incorporation
                </a>)
            }
            
            {!showUpload && (<p className='btn text-light' onClick={() => setShowUpload(!showUpload)}>&#43;</p>)}

            {showUpload && (
                <div className='block d-flex flex-row my-3 align-items-center'>
                    <FileInput setFile={setFormFile} />
                    {formFile && (
                        <button 
                        className='btn btn-sm btn-light m-2 h-50'
                        onClick={() => {
                            uploadFile({variables: {
                                clientId: clientId,
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
    )
}

export default ClientDoc