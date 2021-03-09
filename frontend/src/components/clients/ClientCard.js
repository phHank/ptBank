import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'

import ClientDoc from './ClientDoc'
import ClientCardText from './ClientCardText'
import DeleteClientCard from './DeleteClientCard' 
import ClientUpdateOptions from './ClientUpdateOptions'
import ClientCardFooter from './ClientCardFooter'


const ClientCard = ({clientData, setEdit, g3}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    return (
        <Card bg='dark' text='light' className='m-5'>

            
            <ClientCardText clientData={clientData} /> 

            <ClientDoc clientId={clientData.id} incorpCert={clientData.incorpCert} />

            {confirmDelete && (<DeleteClientCard setConfirmDelete={setConfirmDelete} clientId={clientData.id} />)}
            
            {/* TODO: Change to g2 */}
            {g3 && (<ClientUpdateOptions setConfirmDelete={setConfirmDelete} setEdit={setEdit} />)}
            
            <ClientCardFooter lastUpdated={clientData.lastUpdated} username={clientData.updatedBy.username} /> 
        </Card>
    )
}

export default ClientCard