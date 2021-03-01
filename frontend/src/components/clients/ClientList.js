import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import Jumbotron from 'react-bootstrap/Jumbotron'
import Table from 'react-bootstrap/Table'

import Loading from '../Loading'
import ClientRow from './ClientRow'
import AddClientForm from './AddClientForm'

export const GET_CLIENTS_QUERY = gql`
query GetClientsQuery (
  $clientId: Int
  $search: String
  ) {
    clients (
      clientId: $clientId
      search: $search
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
  }
`

const ClientList = () => {
  const history = useHistory()
  const {location: {searchData}} = history

  let {data, loading, error, refetch} = useQuery(GET_CLIENTS_QUERY)

  useEffect(() => {
    if (!searchData) refetch()
  }, [])

  if (searchData) {
    data = searchData
  }

  // TODO implement ordering and pagination for client query. 

  if (loading) return <Loading />

  // if (true) return <div>{JSON.stringify(data)}</div>

  return (
      <div className='container'>
          {error && <p className='error-message'>Error getting client data: {error.message}</p>}
          <Jumbotron 
            className='d-flex justify-content-center bg-light mt-3 border border-dark border-5 rounded' 
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
                {searchData && (
                  <tfoot >
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>Matches Found: {searchData.clients.length}</td>
                    </tr>
                  </tfoot>
                )}
            </Table>
          </Jumbotron>
          <div className='container d-flex justify-content-center my-3'>
            <AddClientForm />
          </div>
          <div style={{height: 10}}></div>
      </div>
  )
}

export default ClientList