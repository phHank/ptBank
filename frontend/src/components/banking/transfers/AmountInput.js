import React from 'react'

import { currencyList } from '../../../utils/constants'


const AmountInput = ({handleChange, formData}) => (
    <>
        <label className='col'>Transfer Amount: </label>
        <div className='form-control w-50 bg-dark'>
        <select
            id='val'
            className='bg-light text-dark mt-1'
            style={{
            padding: 10,
            border: '1px solid rgba(0,0,0,0.3)',
            borderRadius: 4
            }}
            onChange={e => handleChange(e, 'currency')}
            value={formData.currency}
        >
            {currencyList.map(option => 
                (<option key={option} value={option}>{option}</option>)
            )}
        </select>

        <input
            className='bg-light text-dark'
            type='number' 
            step='0.01' 
            min='0.01'
            placeholder='0.00' 
            value={formData.amount} 
            onChange={e => handleChange(e, 'amount')} 
        />
        </div>
    </>
)

export default AmountInput