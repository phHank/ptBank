import React from 'react'

import { useMutation, useQuery, gql } from '@apollo/client'

import Spinner from 'react-bootstrap/Spinner'
import Jumbotron from 'react-bootstrap/Jumbotron'
import Table from 'react-bootstrap/Table'

import ClientRow from './ClientRow'


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

export const NEW_CLIENT_MUTATION = gql`
mutation NewClientMutation (
    $firstName: String!
    $surnames: String!
    $companyName: String!
    $gender: String!
    $title: String!
    $email: String!
    $phone:  String!
){
    createClientProfile (
      firstName: $firstName
      surnames: $surnames
      companyName: $companyName
      gender: $gender
      title: $title
      email: $email
      phone: $phone
    ) {
        clientProfile {
        id
        email
        firstName
        surnames
        createdBy {
          username
        }
        dateCreated
        updatedBy {
          username
        }
        lastUpdated
         }
    }
  }
`

const ClientList = () => {
    const {data, loading, error} = useQuery(GET_CLIENTS_QUERY, {
      variables: {clientId: 1}
    })

    if (loading) return (
        <div className='d-flex w-100 h-100 justify-content-center'>
            <Spinner animation="border" role="status" variant="primary" />
        </div>
    )

    // TODO  useMutation to create new client. 

    return (
        <>
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
                            <th>Last Updated By</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.clients.map(client => <ClientRow key={client.id} clientData={client} />)}
                    </tbody>
                </Table>
            </Jumbotron>
        </>
    )
}

export default ClientList