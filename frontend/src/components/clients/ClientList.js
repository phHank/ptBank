import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../utils/constants'

import Table from 'react-bootstrap/Table'

import Loading from '../Loading'
import TableHead from '../TableHead'
import ClientRow from './ClientRow'
import TableFooter from '../TableFooter'
import PaginateBar from '../PaginateBar'
import AddClientForm from './AddClientForm'

export const GET_CLIENTS_QUERY = gql`
query GetClientsQuery (
  $clientId: Int
  $search: String
  $skip: Int
  $first: Int
  $orderBy: String = "company_name"
	$target: String = "clients"
  ) {
    clients (
      clientId: $clientId
      search: $search
      skip: $skip
      first: $first
      orderBy: $orderBy
      ) {
      id
      firstName
      surnames
      companyName
      country
      title
      gender
      email
      phone
      incorpCert
      uploadDate
      createdBy {
        id
        username
        }
      dateCreated
      updatedBy {
          id
          username
      }
      lastUpdated
    }
		count (target: $target)
    companies {
      id
      coName
    }
  }
`

const ClientList = () => {
  const [pageNo, setPageNo] = useState(1)
  const history = useHistory()
  const {location: {searchData, deletedClient}} = history

  let {data, loading, error, refetch} = useQuery(GET_CLIENTS_QUERY, {
    variables: {first: resultsPerPage}
  })

  if (searchData) {
    data = searchData
  }

  if (loading) return <Loading />

  return (
      <div className='container'>
          {deletedClient && <p className='success-message'>{deletedClient} has been deleted</p>}
          {error && <p className='error-message'>Error getting client data: {error.message}</p>}
          <div className='d-flex flex-column align-items-center mt-3 p-3'>
            <h3 className='bg-dark text-light rounded p-2'>Clients</h3>
            <Table striped size hover bordered variant='dark'>
              <TableHead 
                refetch={refetch} 
                headings={['Company Name', 'First Name', 'Surnames', 'Updated By']}  
              />
              <tbody>
                {data?.clients.map(client => <ClientRow key={client.id} clientData={client} />)}
              </tbody>
              {searchData && (<TableFooter resCount={searchData?.clients.length} />)}
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
          <div className='container d-flex justify-content-center my-3'>
            <AddClientForm />
          </div>
          <div style={{height: 10}}></div>
      </div>
  )
}

export default ClientList