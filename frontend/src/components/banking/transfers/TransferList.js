import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import Table from 'react-bootstrap/Table'

import Loading from '../../Loading'
import TableHead from '../../TableHead'
import TransferRow from './TransferRow'
import TableFooter from '../../TableFooter'
import AddTransferForm from './AddTransferForm'

export const GET_TRANSFERS = gql`
    query GetTransfers (
        $month: Int 
        $year: Int 
        $orderBy: String 
        $search: String
        ) {
        transfers (
            month: $month 
            year: $year 
            orderBy: $orderBy 
            search: $search
            ) {
                id
                paymentDate
                urgent
                currency
                amount
                benifName
                account {
                    accName
                }
        }
    }
`

export const currentMonth = new Date().getMonth() + 1
export const currentYear = new Date().getFullYear()

const TransferList = () => {
    const [month, setMonth] = useState(currentMonth)
    const [year, setYear] = useState(currentYear)
    const history = useHistory()
    const {location: {searchData}} = history

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec']

    const yearRange = []
    for (let i=2021; i<=currentYear; i++) {
        yearRange.push(i)
    }

    let { data, loading, error, refetch} = useQuery(GET_TRANSFERS, {
        variables: {
            month,
            year
        }
    })

    if (searchData) {
        data = searchData
    }

    if (loading) return <Loading/>

    return (
        <div className='d-flex flex-column align-items-center container'>
            {error && <p className='error-message'>Error getting Transfers: {error.message}</p>}

            {!searchData && (
            <div className='m-3 align-self-start'>
                <select defaultValue={month} className='bg-dark text-light rounded' onChange={({target}) => setMonth(target.value)}>
                    {months.map((m, i) => <option key={i} value={i+1}>{m}</option>)}
                </select>
                <select defaultValue={year} className='bg-dark text-light rounded' onChange={({target}) => setYear(target.value)}>
                    {yearRange.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            )}

            <h3 className='bg-dark text-light rounded p-2 mt-1'>Transfers</h3>

            <Table size hover bordered variant='dark'>
              <TableHead 
                refetch={refetch} 
                headings={['Account Name', 'Payment Date', 'Amount', 'Benificiary Name']}  
              />
              <tbody>
                {data?.transfers.map(tr => <TransferRow key={tr.id} transferData={tr} />)}
              </tbody>
              {searchData && (<TableFooter resCount={searchData?.transfers.length} />)}
            </Table>
        
            <AddTransferForm />
        </div>
    )
}

export default TransferList