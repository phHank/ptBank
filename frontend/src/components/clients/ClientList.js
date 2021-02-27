import React, { useEffect } from 'react'

import { useQuery, gql } from '@apollo/client'

import Spinner from 'react-bootstrap/Spinner'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Table from 'react-bootstrap/Table'

import ClientRow from './ClientRow'
import AddClientForm from './AddClientForm'

export const GET_CLIENTS_QUERY = gql`
query GetClientsQuery ($clientId: Int) {
    clients (clientId: $clientId) {
      id
      firstName
      surnames
      companyName
      createdBy {
        id
      }
      dateCreated
      updatedBy {
        username
      } 
      lastUpdated
    }
  }
`

const ClientList = () => {
  const {data, loading, error, refetch} = useQuery(GET_CLIENTS_QUERY)

  // TODO implement orderings, filtering and search for clients query. 

  useEffect(() => {
    refetch()
  }, [])
  
  if (loading) return (
      <div className='d-flex w-100 h-100 justify-content-center'>
          <Spinner animation="border" role="status" variant="primary" />
      </div>
  ) 

  return (
      <div className='h-100'>
          {error && <p className='error-message'>Error getting client data: {error.message}</p>}
          <Jumbotron 
            className='d-flex justify-content-center bg-light m-3 border border-dark border-5 rounded' 
            style={{opacity: 0.75}}
          >
              <Table className='m-3 align-self-center' striped size hover bordered variant='dark'>
                  <thead>
                      <tr>
                          <th>Company Name</th>
                          <th>First Name</th>
                          <th>Surname(s)</th>
                          <th>Updated By</th>
                      </tr>
                  </thead>
                  <tbody>
                      {data?.clients.map(client => <ClientRow key={client.id} clientData={client} />)}
                  </tbody>
              </Table>
          </Jumbotron>
          <div className='d-flex justify-content-center'>
            <AddClientForm />
          </div>
      </div>
  )
}

export default ClientList