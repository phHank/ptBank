import React, { useState, useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../utils/constants'

import Jumbotron from 'react-bootstrap/Jumbotron'
import Table from 'react-bootstrap/Table'

import Loading from '../Loading'
import ClientRow from './ClientRow'
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
  }
`

const ClientList = () => {
  const [pageNo, setPageNo] = useState(1)
  const history = useHistory()
  const {location: {searchData}} = history

  let {data, loading, error, refetch} = useQuery(GET_CLIENTS_QUERY, {
    variables: {first: resultsPerPage}
  })

  useEffect(() => {
    if (!searchData) refetch({first: resultsPerPage})
  }, [])

  if (searchData) {
    data = searchData
  } 

  const handlePageChange = newPageNo => {
    setPageNo(newPageNo)
    
    refetch({
      skip: (newPageNo - 1) * resultsPerPage,
      first: resultsPerPage
    })
  }

  if (loading) return <Loading />

  return (
      <div className='container'>
          {error && <p className='error-message'>Error getting client data: {error.message}</p>}
          <Jumbotron 
            className='d-flex flex-column align-items-center bg-light mt-3 p-3 border border-dark border-5 rounded'
          >
            <Table striped size hover bordered variant='dark'>
                <thead>
                    <tr>
                        <th onClick={() => refetch({orderBy: 'company_name'})}>Company Name</th>
                        <th onClick={() => refetch({orderBy: 'first_name'})}>First Name</th>
                        <th onClick={() => refetch({orderBy: 'surnames'})}>Surname(s)</th>
                        <th onClick={() => refetch({orderBy: 'updated_by'})}>Updated By</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.clients.map(client => <ClientRow key={client.id} clientData={client} />)}
                </tbody>
                {searchData && (
                  <tfoot >
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Matches Found: {searchData?.clients.length}</td>
                    </tr>
                  </tfoot>
                )}
            </Table>
						{!searchData && (
            	<div className='d-block'>
								<PaginateBar 
								  page={pageNo} 
									stopPage={ data?.count / resultsPerPage} 
									handlePageChange={handlePageChange}
								/>
							</div>
						)}
          </Jumbotron>
          <div className='container d-flex justify-content-center my-3'>
            <AddClientForm />
          </div>
          <div style={{height: 10}}></div>
      </div>
  )
}

export default ClientList