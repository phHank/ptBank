import React, { useState } from 'react'

import { useMutation, useQuery, gql } from '@apollo/client'
import { GET_COMPANIES_QUERY } from './CompanyList'
import { GET_CLIENT_LIST_QUERY } from './AddCompanyForm'

import Card from 'react-bootstrap/Card'

import Loading from '../Loading'
import TextInput from '../forms/TextInput'
import SelectInput from '../forms/SelectInput'
import ClientDropDown from './ClientDropDown'

import { countryList } from '../../utils/constants'

const UPDATE_CO_MUTATION = gql`
mutation UpdateCoMutation (
    $clientId: Int!
    $coId: Int!
    $coName: String!
    $address1: String!
    $address2: String
    $city: String!
    $country: String!
) {
  updateCompany (
    clientId: $clientId
    coId: $coId
    coName: $coName
    address1: $address1
    address2: $address2
    city: $city
    country: $country
  ) {
    company {
      id
      coName
      address1
      address2
      city
      country
      updatedBy{
        id
        username
      }
      lastUpdated
      clientProfile{
        id
        companyName
        firstName
        surnames
      }
    }
  }
}
`


const UpdateCompanyForm = ({coData, setEdit}) => {
    const [formData, setFormData] = useState({
        clientId: coData.clientProfile.id,
        coName: coData.coName,
        address1: coData.address1,
        address2: coData.address2,
        city: coData.city,
        country: coData.country,
    })
    const [clientList, setClientList] = useState([])
    const [disableEdit, setDisableEdit] = useState(true)

    useQuery(GET_CLIENT_LIST_QUERY, {
        onCompleted: ({clients})=> {
            const clientNames = clients.map(client => ({
                clientId: client.id,
                client: client.companyName === 'Private Individual'
                    ? `${client.firstName} ${client.surnames}`
                    : client.companyName
            }
            ))

            setClientList(clientNames)
        },
        onError: error => setError(error)
    })

    const [updateCo, {loading, error}] = useMutation(UPDATE_CO_MUTATION, {
        variables: {
            clientId: formData.clientId,
            coId: coData.id,
            coName: formData.coName,
            address1: formData.address1,
            address2: formData.address2,
            city: formData.city,
            country: formData.country
        },
        update: (cache, {data: {updateCompany: {company}}}) => {
            const { companies } = cache.readQuery({
                query: GET_COMPANIES_QUERY,
                variables: {
                    coId: coData.id
                }
            })

            cache.writeQuery({
                query: GET_COMPANIES_QUERY,
                data: {
                    companies: companies.map(co => (
                        co.id === coData.id
                          ? company
                          : co
                    ))
                }
            })
        },
        onCompleted: () => setEdit(false)
    })

    const handleChange = (event, name) => {
        setFormData({
            ...formData,
            [name]: event.target.value
        })
    }

    if (loading) return <Loading />

    return (
        <Card bg='dark' text='light' className='m-3 p-1'>
            <form 
              className='d-flex flex-column' 
              onSubmit={e => {
                e.preventDefault()
                updateCo()
              }}
            >
              {error && <p className='error-message'>Error updating comapny: {error.message}</p>}
                              
              <div className='d-flex flex-row align-items-center'>
                  <ClientDropDown 
                    name={'clientId'}
                    placeholder={'Client Name'}
                    options={clientList}
                    handleChange={handleChange}
                    defaultVal={formData.clientId}
                    req={true}
                    disabled={disableEdit}
                  />
                  <input type='checkbox' className='mx-1' id='edit-client' onChange={() => setDisableEdit(!disableEdit)} />
                  <label htmlFor='edit-client'><small>Change company's client?</small></label>
              </div>

              <TextInput 
                name={'coName'}
                placeholder={'Company Name'} 
                value={formData.coName} 
                handleChange={handleChange}
                req={true}
              />
              <TextInput 
                name={'address1'}
                placeholder={'Block A, 5th Floor, The Atrium'} 
                value={formData.address1} 
                handleChange={handleChange}
                req={true}
              />
              <TextInput 
                name={'address2'}
                placeholder={'Blackthorn Road, Sandyford'} 
                value={formData.address2} 
                handleChange={handleChange}
              />
              <TextInput 
                name={'city'}
                placeholder={'Dublin'} 
                value={formData.city} 
                handleChange={handleChange}
                req={true}
              />
              <SelectInput 
                name={'country'}
                options={countryList}
                handleChange={handleChange}
                defaultVal={formData.country}
                req={true}
              />
              <div className='d-flex w-100 justify-content-end'>
                  <button type='submit' className='btn btn-sm btn-primary'>Submit</button>
                  <button className='btn btn-sm btn-light mx-1' onClick={() => setEdit(false)}>Cancel</button>
              </div>
            </form>
        </Card>
    )
}

export default UpdateCompanyForm