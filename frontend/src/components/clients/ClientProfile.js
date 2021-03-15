import React, { useState } from 'react'

import { useHistory, Redirect } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { GET_CLIENTS_QUERY } from './ClientList'

import ClientCard from './ClientCard'
import UpdateClientForm from './UpdateClientForm'
import Loading from '../Loading'

const ClientProfile = g2 => {
    const [edit, setEdit] = useState(false)
    const history = useHistory()

    const pathArray = history.location.pathname.split('/')
    const clientId = pathArray[pathArray.length -1]

    const { data, loading, error } = useQuery(GET_CLIENTS_QUERY,{
        variables: {clientId}
    })
    
    if (loading) return <Loading />

    if (error?.message === 'Client profile not found.') return <Redirect to='/404-not-found' />

    const clientData = data?.clients[0]

    return (
        <div className='container d-flex justify-content-center'>
            {error
              ? (<p className='error-message'>Error getting client data: {error.message}</p>)
              : (!edit 
                  ? (<ClientCard setEdit={setEdit} g2={g2} clientData={clientData} />)
                  : (<UpdateClientForm clientData={clientData} setEdit={setEdit} />)
                )
            }   
        </div>
    )
}

export default ClientProfile