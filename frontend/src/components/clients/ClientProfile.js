import React from 'react'

import { useHistory, Redirect } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { GET_CLIENTS_QUERY } from './ClientList'

import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'

import { clientCoImg, clientImg } from '../../utils/constants'
import { getDateTime } from '../../utils/helpers'

const ClientProfile = () => {
    const history = useHistory()

    let requestError = null
    let clientData = history.location.clientData

    if (!history.location.clientData) {
        const pathArray = history.location.pathname.split('/')

        const clientId = pathArray[pathArray.length -1]

        const { data, loading, error } = useQuery(GET_CLIENTS_QUERY,{
            variables: {clientId}
        })

        if (loading) return (
            <div className='d-flex w-100 h-100 justify-content-center'>
                <Spinner animation="border" role="status" variant="primary" />
            </div>
        )

        if (error) {
            requestError = error.message
        }

        clientData = data?.clients[0]
    }

    if (requestError === 'Client profile not found.') return <Redirect to='/404-not-found' />

    return (
        <div className='d-flex justify-content-center'>
            {requestError 
              ? (<p className='error-message'>Error getting client data: {requestError}</p>)
              : (
                <Card bg='dark' text='light' className='m-5'>
                    <div className='w-100 d-flex justify-content-center' >
                        <Card.Img 
                        style={{maxWidth: '20rem'}}
                        variant='top' 
                        src={clientData.companyName === 'Private Individual' ? clientImg : clientCoImg } 
                        />
                    </div>
                    <Card.Body>
                    <Card.Title>
                        {clientData.companyName 
                        ? clientData.companyName 
                        : `${clientData.firstName} ${clientData.surnames}`
                        }
                        </Card.Title>
                    <Card.Text></Card.Text>
                    <Card.Text>
                        {clientData.firstName + ' ' + clientData.surnames}
                    </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                        <small className="text-muted">
                            Last updated {getDateTime(new Date(clientData.lastUpdated))} by {clientData.updatedBy.username}.
                        </small>
                    </Card.Footer>
                </Card>
                )
            }   
        </div>
    )
}

export default ClientProfile