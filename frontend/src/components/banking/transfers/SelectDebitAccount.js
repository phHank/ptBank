import React from 'react'

import { useQuery } from '@apollo/client'

import { GET_ACCOUNTS_QUERY } from '../accounts/AccountList'


const SelectDebitAccount = ({handleAccountSelect}) => {
    const { data } = useQuery(GET_ACCOUNTS_QUERY)

    return (
        <>
            <label htmlFor='acc'>Debiting Account</label>
            <select id='acc' className='form-control' onChange={e => handleAccountSelect(e)} defaultValue='disabled'>
                <option disabled value='disabled'>-</option>
            {data?.bankAccounts.map(acc => (
                <option key={acc.id} value={`${acc.id};${acc.currencyCode}`}>
                    {acc.accName} {acc.currencyCode} | {acc.bank.name}
                </option>))}
            </select>
        </>
    )
}

export default SelectDebitAccount