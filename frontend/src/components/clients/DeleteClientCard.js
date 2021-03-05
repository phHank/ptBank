import React from 'react'

import { useHistory } from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import { GET_CLIENTS_QUERY } from './ClientList'
import Loading from '../Loading'

import { resultsPerPage } from '../../utils/constants'

const DELETE_CLIENT_MUTATION = gql`
mutation DeleteClientMutation ($id: Int!) {
    deleteClientProfile(clientProfileId: $id) {
      clientProfile {
        id
        companyName
        firstName
        surnames
    }
  }
}
`

const DeleteClientCard = ({clientId, setConfirmDelete}) => {
    const history = useHistory()

    const [deleteClient, { loading, error }] = useMutation(DELETE_CLIENT_MUTATION, {
        variables: {id: clientId},
        update: (cache) => {
          const { clients } = cache.readQuery({
            query: GET_CLIENTS_QUERY,
            variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_CLIENTS_QUERY,
            variables: {first: resultsPerPage},
            data: {
              clients: clients.filter(client => (
                client.id !== clientId
              ))
            }
          })
        },
        onCompleted: ({deleteClientProfile}) => {
            const { clientProfile } = deleteClientProfile

            history.push({
                pathname: '/clients',
                deletedClient: clientProfile.companyName === 'Private Individual' 
                  ? `${clientProfile.firstName} ${clientProfile.surnames}`
                  : clientProfile.companyName
            })
        }
    })

    if (loading) return <Loading />

    return (
        <div className='w-100 d-flex justify-content-center'>
            <div style={{ width: '15rem' }} className="m-2 bg-danger text-light rounded">
                {error && <p className='error-message'>Error deleting client profile: {error.message}</p>}
                <h6 className='text-center'>Delete this client profile?</h6>
                <div className='d-flex w-100 justify-content-around center p-1'>
                    <button
                      className='btn btn-sm btn-light'
                      onClick={() => {
                        deleteClient()
                      }}
                    >
                        Yes
                    </button>
                    <button 
                      className='btn btn-sm btn-light'
                      onClick={() => setConfirmDelete(false)}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteClientCard