import React from 'react'

const CompanyUpdateOptions = ({setConfirmDelete, setEdit}) => (
    <div className='d-flex w-100 justify-content-start'>
        <button 
          className='btn btn-sm btn-light mx-1'
          onClick={() => {
            setConfirmDelete(false)
            setEdit(true)
          }}
        >
          Edit Company
        </button>
        <button 
          className='btn btn-sm btn-danger'
          onClick={() => setConfirmDelete(true)}
        >
          Delete Company
        </button>
    </div>
)

export default CompanyUpdateOptions