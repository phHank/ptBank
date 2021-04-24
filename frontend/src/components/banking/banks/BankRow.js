import React, { useState } from 'react'

import { useMutation, gql } from '@apollo/client'

const UPDATE_BANK = gql`
mutation UpdateBank ($bankId: Int!, $name: String!, $country: String!) {
    updateBank(bankId: $bankId, name: $name, country: $country ) {
        bank {
        id
        }
    }
}
`

const BankRow = ({bankData}) => {
    const [edit, setEdit] = useState(false)
    const [formData, setForm] = useState({
        name: bankData.name,
        country: bankData.country
    })

    const [editBank, {error}] = useMutation(UPDATE_BANK, {
        variables: {
            bankId: bankData.id,
            name: formData.name,
            country: formData.country
        },
        onCompleted: () => setEdit(false)
    })

    if (error) return <td className='text-danger bg-dark text-center'>Error updating Bank: {error.message}</td>
    
    return (
        edit 
            ? (
            <tr>
                <td>
                    <input 
                      className='form-control form-control-sm bg-dark text-light' 
                      type='text' placeholder='Bank Name' 
                      value={formData.name} 
                      onChange={({target}) => setForm({...formData, name: target.value})} 
                    />
                </td>
                <td>
                    <input 
                      className='form-control form-control-sm bg-dark text-light' 
                      type='text' placeholder='Country' 
                      value={formData.country} 
                      onChange={({target}) => setForm({...formData, country: target.value})}
                    />
                </td>
                <td className='d-flex justify-content-around'>
                    <button 
                      className='btn btn-info btn-sm' 
                      onClick={() => editBank()}
                    >
                        Submit
                    </button>
                </td>
            </tr>)
            : (
            <tr>
                <td>{bankData.name}</td>
                <td>{bankData.country}</td>
                <td className='d-flex justify-content-around'>
                    <button 
                      className='btn btn-primary btn-sm' 
                      onClick={() => setEdit(true)}
                    >
                        Edit
                    </button>  
                </td>
            </tr>)
    )
}

export default BankRow