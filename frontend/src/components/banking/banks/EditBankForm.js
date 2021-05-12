import React, { useState } from 'react'

import { useMutation, gql } from '@apollo/client'

import { countryList } from '../../../utils/constants'

const UPDATE_BANK = gql`
mutation UpdateBank ($bankId: Int!, $name: String!, $country: String!) {
    updateBank(bankId: $bankId, name: $name, country: $country ) {
        bank {
        id
        name
        country
        }
    }
}
`

const EditBankForm = ({setEdit, bankData}) => {
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
        <tr>
            <td>
                <input 
                className='form-control form-control-sm bg-dark text-light' 
                type='text' placeholder='Bank Name' 
                value={formData.name} 
                onChange={({target}) => setForm({...formData, name: target.value})}
                required
                />
            </td>
            <td>
                <select
                onChange={({target}) => setForm({...formData, country: target.value})}
                className='form-control form-control-sm bg-dark text-light'
                defaultValue={formData.country}
                required
                >
                    {countryList.map(option => 
                        (<option key={option} value={option}>{option}</option>)
                    )}
                </select>
            </td>
            <td className='d-flex justify-content-around'>
                <button 
                className='btn btn-info btn-sm' 
                onClick={() => editBank()}
                >
                    Submit
                </button>
            </td>
        </tr>
    )
}

export default EditBankForm