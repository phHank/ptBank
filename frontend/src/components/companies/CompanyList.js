import React, { useState } from 'react'

import { useHistory } from 'react-router-dom'

import { useQuery, gql } from '@apollo/client'

import { resultsPerPage } from '../../utils/constants'

import Table from 'react-bootstrap/Table'

import Loading from '../Loading'
import TableHead from '../TableHead'
import CompanyRow from './CompanyRow'
import TableFooter from '../TableFooter'
import PaginateBar from '../PaginateBar'
import AddCompanyForm from './AddCompanyForm'


export const GET_COMPANIES_QUERY = gql`
query GetCompaniesQuery(
	$coId: Int
	$search: String
	$first: Int
	$skip: Int
	$orderBy: String
	$target: String = "companies"
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
		accountHolder {
			id
			accName
			iban
			currencyCode
			bank {
			  name
			}
			transfers {
			  id
			  currency
			  amount
			  benifName
			  paymentDate
			}
		}
	}
	count (target: $target)
}
`

const CompanyList = () => {
	const [pageNo, setPageNo] = useState(1)
	const history = useHistory()
	const {location: {searchData, deletedCompany}} = history

	let {data, loading, error, refetch} = useQuery(GET_COMPANIES_QUERY, {
		variables: {first: resultsPerPage }
	})

	if (searchData) {
		data = searchData
  	}

	if (loading) return <Loading />

	return (
		<div className='container'>
			<div>
				{deletedCompany && <p className='success-message'>{deletedCompany} has been deleted</p>}
				{error && <p className='error-message'>Error getting companies' data: {error.message}</p>}
				
				<div className='d-flex flex-column align-items-center mt-3 p-3'>
					<h3 className='bg-dark text-light rounded p-2'>Companies</h3>
					<Table striped size hover bordered variant='dark'>
					<TableHead 
						refetch={refetch} 
						headings={['Co Name', 'City', 'Country', 'Updated By']}  
					/>
					<tbody>
						{data?.companies.map(company => <CompanyRow key={company.id} coData={company} /> )}
					</tbody>
					{searchData && (<TableFooter resCount={searchData?.companies.length} />)}
					</Table>
					{!searchData && (
						<div className='d-block'>
							<PaginateBar 
							  page={pageNo} 
							  count={data?.count} 
							  setPageNo={setPageNo}
							  refetch={refetch}
							/>
						</div>
					)}
				</div>
				
				<div className='container d-flex justify-content-center my-3'>
					<AddCompanyForm />
				</div>
			</div>
		</div>
	)
}

export default CompanyList