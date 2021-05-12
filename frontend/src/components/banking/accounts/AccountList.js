import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../../utils/constants'

import Table from 'react-bootstrap/Table'

import Loading from '../../Loading'
import TableHead from '../../TableHead'
import AccountRow from './AccountRow'
import TableFooter from '../../TableFooter'
import PaginateBar from '../../PaginateBar'
import AddAccountForm from './AddAccountForm'

export const GET_ACCOUNTS_QUERY = gql`
query GetAccountsQuery (
  $search: String
  $first: Int
  $skip: Int
  $orderBy: String
  ) {
    bankAccounts (
      search: $search
      first: $first
      skip: $skip
      orderBy: $orderBy
      ) {
      id
      accName
      iban
      swift
      accountNo
      sortCode
      currencyCode
      bank {
        id
        name
      }
      company {
        id
        coName
      }
    }
    count (target: "accounts")
  }
`

const AccountList = ({g3}) => {
  const [pageNo, setPageNo] = useState(1)
  const history = useHistory()
  const {location: {searchData}} = history

  let {data, loading, error, refetch} = useQuery(GET_ACCOUNTS_QUERY, {
    variables: {first: resultsPerPage}
  })

  if (searchData) {
    data = searchData
  }

  if (loading) return <Loading />

  return (
      <div className='container'>
          {error && <p className='error-message'>Error getting bank data: {error.message}</p>}
          <div className='d-flex flex-column align-items-center mt-3 p-3'>
            <h3 className='bg-dark text-light rounded p-2'>Bank Accounts</h3>
            <Table striped size hover bordered variant='dark'>
              <TableHead 
                refetch={refetch} 
                headings={['Acc Name', 'Currency Code', 'IBAN', 'SWIFT']}  
              />
              <tbody>
                {data?.bankAccounts.map(acc => <AccountRow key={acc.id} accData={acc} />)}
              </tbody>
              {searchData && (<TableFooter resCount={searchData?.bankAccounts.length} />)}
            </Table>
				    {!searchData && (
            	<div className='d-block'>
                <PaginateBar 
                  page={pageNo} 
                  count={data?.count}  
                  setPageNo={setPageNo}
                  refetch={refetch}
                />
				      </div>
				    )}
          </div>
          {g3 && (
            <div className='container d-flex justify-content-center my-3'>
                <AddAccountForm />
            </div>
          )}
          <div style={{height: 20}}></div>
      </div>
  )
}

export default AccountList