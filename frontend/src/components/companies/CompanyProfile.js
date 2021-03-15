import React, { useState } from 'react'

import { useHistory, Redirect } from 'react-router-dom'

import { useQuery } from '@apollo/client'
import { GET_COMPANIES_QUERY } from './CompanyList'

import CompanyCard from './CompanyCard'
import UpdateCompanyForm from './UpdateCompanyForm'
import Loading from '../Loading'

const CompanyProfile = g2 => {
    const [edit, setEdit] = useState(false)
    const history = useHistory()

    const pathArray = history.location.pathname.split('/')
    const coId = pathArray[pathArray.length -1]

    const { data, loading, error } = useQuery(GET_COMPANIES_QUERY,{
        variables: {coId}
    })
    
    if (loading) return <Loading />

    if (error?.message === 'Company not found.') return <Redirect to='/404-not-found' />

    const coData = data?.companies[0]

    return (
        <div className='container d-flex justify-content-center'>
            {error
              ? (<p className='error-message'>Error getting company data: {error.message}</p>)
              : (!edit 
                  ? (<CompanyCard setEdit={setEdit} g2={g2} coData={coData} />)
                  : (<UpdateCompanyForm coData={coData} setEdit={setEdit} />)
                )
            }   
        </div>
    )
}

export default CompanyProfile