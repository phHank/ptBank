import React from 'react'

import { Link } from 'react-router-dom'

import { clientCoImg } from '../../utils/constants'

const CompanyCardText = ({coData}) => (
    <>
        <div className='w-100 d-flex justify-content-center p-1' >
            <img 
            style={{maxWidth: '20rem', borderRadius: "5%"}}
            src={ clientCoImg } 
            />
        </div>
        <div className='container'>
            <h4 className='mt-2 text-center'>
                {coData.coName}
            </h4>
            <hr/>
            <div className='d-flex flex-row'>
                <p>Address:&nbsp;</p>
                <p> {coData.address1} <br/> 
                    {coData.address2} {coData.address2 && (<br/>)}
                    {coData.city} <br/> 
                    {coData.country} <br/>
                </p>
            </div>
            <Link 
              className='d-flex flex-row'
              to={`/clients/${coData.clientProfile.id}`} 
              style={{color: '#FFF', textDecoration: 'none'}}
            >
                <p>Client:&nbsp;</p>     
                <p>{coData.clientProfile.companyName}</p>
            </Link>
        </div>
    </>
)

export default CompanyCardText