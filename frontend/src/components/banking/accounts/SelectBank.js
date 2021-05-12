import React from 'react'

import { useQuery } from '@apollo/client'
import { GET_BANKS_QUERY } from '../banks/BankList'

const SelectBank = ({setFormData, formData}) => {
    const { data: banksData } = useQuery(GET_BANKS_QUERY)

    return (
        <div>
            <label className='col-xl-12'>Bank</label>
            <select 
            className='bg-light text-dark mt-1 w-50'
            onChange={e => setFormData({
                ...formData,
                bankId: e.target.value
            })}
            style={{
                padding: 10,
                border: '1px solid rgba(0,0,0,0.3)',
                borderRadius: 4
            }}
            defaultValue='disabled'
            >
            <option value='disabled' disabled>-</option>
            {banksData?.banks.map(bank => <option key={bank.id} value={bank.id}>{bank.name}</option>)}
            </select>
        </div>
    )
}


export default SelectBank