import React, { useState } from 'react'

import { useMutation } from '@apollo/client'

import { CO_UPLOAD_DOC_MUTATION } from './AddCompanyForm'
import { GET_COMPANIES_QUERY } from './CompanyList'

import Loading from '../Loading'
import FileInput from '../forms/FileInput'

import { linkStyle } from '../../utils/constants'

const CompanyDoc = ({ coId, incorpCert }) => {
    const [formFile, setFormFile] = useState(null)
    const [showUpload, setShowUpload] = useState(false)
    const [error, setError] = useState('')

    const [uploadFile, {loading}] = useMutation(CO_UPLOAD_DOC_MUTATION, {
        update: (cache, {data: {companyUpload: {company: {incorpCert}}}}) => {
            const { companies } = cache.readQuery({
              query: GET_COMPANIES_QUERY,
              variables: {coId}
            })
  
            cache.writeQuery({
              query: GET_COMPANIES_QUERY,
              variables: {coId},
              data: {
                companies: [{
                    ...companies,
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
                <a href={`http://localhost:8080/media/${incorpCert}`} style={linkStyle} target='_blank'>
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
                                coId,
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

export default CompanyDoc