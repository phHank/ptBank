import React, { useState } from 'react'

import Card from 'react-bootstrap/Card'

import CompanyCardText from './CompanyCardText'
import CompanyDoc from './CompanyDoc'
import DeleteCompanyCard from './DeleteCompanyCard' 
import CompanyUpdateOptions from './CompanyUpdateOptions'
import BankDetails from './BankDetails'
import CompanyCardFooter from './CompanyCardFooter'


const CompanyCard = ({coData, setEdit, g2}) => {
    const [confirmDelete, setConfirmDelete] = useState(false)
    
    return (
        <Card bg='dark' text='light' className='m-5'>
            <div className='d-flex flex-row'>

                <div>
                    <CompanyCardText coData={coData} /> 

                    <CompanyDoc coId={coData.id} incorpCert={coData.incorpCert} />
                </div>

                <div className='align-self-center p-3'>
                    {coData.accountHolder.length > 0 && <BankDetails bankData={coData.accountHolder} />}
                </div>

            </div>
            
            {confirmDelete && (<DeleteCompanyCard setConfirmDelete={setConfirmDelete} coId={coData.id} />)}
            {g2 && (<CompanyUpdateOptions setConfirmDelete={setConfirmDelete} setEdit={setEdit} />)}
            
            <CompanyCardFooter lastUpdated={coData.lastUpdated} username={coData.updatedBy.username} /> 
        </Card>
    )
}

export default CompanyCard