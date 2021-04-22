import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'

import ClientDoc from './ClientDoc'
import CompaniesList from './CompaniesList'
import ClientCardText from './ClientCardText'
import DeleteClientCard from './DeleteClientCard' 
import ClientUpdateOptions from './ClientUpdateOptions'
import ClientCardFooter from './ClientCardFooter'


const ClientCard = ({clientData, setEdit, g2}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    return (
        <Card bg='dark' text='light' className='m-5'>
            
            <ClientCardText clientData={clientData} />

            {clientData.companies.length > 0 && <CompaniesList companies={clientData?.companies} />}

            <ClientDoc clientId={clientData.id} incorpCert={clientData.incorpCert} />

            {confirmDelete && (<DeleteClientCard setConfirmDelete={setConfirmDelete} clientId={clientData.id} />)}
            
            {g2 && (<ClientUpdateOptions setConfirmDelete={setConfirmDelete} setEdit={setEdit} />)}
            
            <ClientCardFooter lastUpdated={clientData.lastUpdated} username={clientData.updatedBy.username} /> 
        </Card>
    )
}

export default ClientCard