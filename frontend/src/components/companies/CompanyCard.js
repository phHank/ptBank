import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'

import CompanyCardText from './CompanyCardText'
import CompanyDoc from './CompanyDoc'
import DeleteCompanyCard from './DeleteCompanyCard' 
import CompanyUpdateOptions from './CompanyUpdateOptions'
import CompanyCardFooter from './CompanyCardFooter'


const CompanyCard = ({coData, setEdit, g2}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    return (
        <Card bg='dark' text='light' className='m-5'>

            <CompanyCardText coData={coData} /> 

            <CompanyDoc coId={coData.id} incorpCert={coData.incorpCert} />

            {confirmDelete && (<DeleteCompanyCard setConfirmDelete={setConfirmDelete} coId={coData.id} />)}
            
            {g2 && (<CompanyUpdateOptions setConfirmDelete={setConfirmDelete} setEdit={setEdit} />)}
            
            <CompanyCardFooter lastUpdated={coData.lastUpdated} username={coData.updatedBy.username} /> 
        </Card>
    )
}

export default CompanyCard