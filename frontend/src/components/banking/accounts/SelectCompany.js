import React from 'react'

import { useQuery, gql } from '@apollo/client'

export const GET_COMPANIES_LIST_QUERY = gql`
query GetCompaniesListQuery {
    companies {
        id
        coName
    }
} 
`

const SelectCompany = ({setFormData, formData}) => {
    const { data: coData } = useQuery(GET_COMPANIES_LIST_QUERY)

    return (
        <div>
            <label className='col-xl-12'>Company</label>
            <select 
            className='bg-light text-dark mt-1 w-50'
            onChange={e => setFormData({
                ...formData,
                coId: e.target.value
            })}
            style={{
                padding: 10,
                border: '1px solid rgba(0,0,0,0.3)',
                borderRadius: 4
            }}
            defaultValue='disabled'
            >
            <option value='disabled' disabled>-</option>
            {coData?.companies.map(company => <option key={company.id} value={company.id}>{company.coName}</option>)}
            </select>
        </div>
    )
}

export default SelectCompany