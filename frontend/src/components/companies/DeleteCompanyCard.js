import React from 'react'

import { useHistory } from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import { GET_COMPANIES_QUERY } from './CompanyList'
import Loading from '../Loading'

import { resultsPerPage } from '../../utils/constants'

const DELETE_CO_MUTATION = gql`
mutation DeleteCoMutation ($coId: Int!) {
    deleteCompany(coId: $coId) {
      company {
        id
        coName
    }
  }
}
`

const DeleteCompanyCard = ({coId, setConfirmDelete}) => {
    const history = useHistory()

    const [deleteCo, { loading, error }] = useMutation(DELETE_CO_MUTATION, {
        variables: {coId},
        update: (cache) => {
          const { companies } = cache.readQuery({
            query: GET_COMPANIES_QUERY,
            variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_COMPANIES_QUERY,
            variables: {first: resultsPerPage},
            data: {
              companies: companies.filter(company => (
                company.id !== coId
              ))
            }
          })
        },
        onCompleted: ({deleteCompany: {company}}) => {
            history.push({
                pathname: '/companies',
                deletedCompany: company.coName
            })
        }
    })

    if (loading) return <Loading />

    return (
        <div className='w-100 d-flex justify-content-center'>
            <div style={{ width: '15rem' }} className="m-2 bg-danger text-light rounded">
                {error && <p className='error-message'>Error deleting company: {error.message}</p>}
                <h6 className='text-center'>Delete this company?</h6>
                <div className='d-flex w-100 justify-content-around center p-1'>
                    <button
                      className='btn btn-sm btn-light'
                      onClick={() => {
                        deleteCo()
                      }}
                    >
                        Yes
                    </button>
                    <button 
                      className='btn btn-sm btn-light'
                      onClick={() => setConfirmDelete(false)}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DeleteCompanyCard