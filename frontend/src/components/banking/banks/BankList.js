import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../../utils/constants'

import Table from 'react-bootstrap/Table'

import Loading from '../../Loading'
import TableHead from '../../TableHead'
import BankRow from './BankRow'
import TableFooter from '../../TableFooter'
import PaginateBar from '../../PaginateBar'
import AddBankForm from './AddBankForm'

export const GET_BANKS_QUERY = gql`
query GetBanksQuery {
    banks {
        id
        name
        country
    }
  }
`

const BankList = ({g3}) => {
  const [pageNo, setPageNo] = useState(1)
  const history = useHistory()
  const {location: {searchData}} = history

  let {data, loading, error, refetch} = useQuery(GET_BANKS_QUERY, {
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
            <h3 className='bg-dark text-light rounded p-2'>Banks</h3>
            <Table striped size hover bordered variant='dark'>
              <TableHead 
                refetch={refetch} 
                headings={['Name', 'Country', '']}  
              />
              <tbody>
                {data?.banks.map(bank => <BankRow key={bank.id} bankData={bank} />)}
              </tbody>
              {searchData && (<TableFooter resCount={searchData?.banks.length} />)}
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
                <AddBankForm />
            </div>
          )}
          <div style={{height: 10}}></div>
      </div>
  )
}

export default BankList