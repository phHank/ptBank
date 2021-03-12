import React from 'react'

// import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../utils/constants'

// import Table from 'react-bootstrap/Table'

import Loading from '../Loading'
// import PaginateBar from '../PaginateBar'
import AddCompanyForm from './AddCompanyForm'


export const GET_COMPANIES_QUERY = gql`
query GetCompaniesQuery(
	$coId: Int
	$search: String
	$first: Int
	$skip: Int
	$orderBy: String
) {
	companies (
		coId: $coId
		search: $search
		first: $first
		skip: $skip
		orderBy: $orderBy 
	) {
		id
		coName
		address1
		address2
		city
		country
		incorpCert
		uploadDate
		clientProfile {
			id
			companyName
			firstName
			surnames
		}
		updatedBy{
			username
		}
		lastUpdated
	}
}
`

const CompanyList = () => {
	const {data, loading, error, refetch} = useQuery(GET_COMPANIES_QUERY, {
		variables: {first: resultsPerPage }
	})

	if (loading) return <Loading />

	return (
		<div>
			{error && <p className='error-message'>Error getting companies' data: {error.message}</p>}
			<p>{JSON.stringify(data)}</p>
			<div className='container d-flex justify-content-center my-3'>
				<AddCompanyForm />
			</div>
		</div>
	)
}

export default CompanyList