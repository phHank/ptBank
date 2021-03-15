import React, { useState } from 'react'

import { useHistory }from 'react-router-dom'

import { useMutation, useQuery, gql } from '@apollo/client'

import { countryList, resultsPerPage } from '../../utils/constants'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Loading from '../Loading'
import ClientDropDown from './ClientDropDown'
import TextInput from '../forms/TextInput'
import SelectInput from '../forms/SelectInput' 
import FileInput from '../forms/FileInput'
import { GET_COMPANIES_QUERY } from './CompanyList'

export const NEW_CO_MUTATION = gql`
mutation NewCoMutation (
	$clientId: Int!
	$coName: String!
	$address1: String!
	$address2: String
	$city: String!
	$country: String!
){
		createCompany (
			clientId: $clientId
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
			incorpCert
			uploadDate
			clientProfile {
				id
				companyName
				firstName
				surnames
			}
			updatedBy {
				username
			}
			lastUpdated
			}
		}
	}
`

export const CO_UPLOAD_DOC_MUTATION = gql`
mutation CoUploadDocMutation (
  $coId: Int!
  $file: Upload!
) {
  companyUpload(coId: $coId, file: $file) {
    company {
      id
      incorpCert
      uploadDate
    }
    success
  }
}
`

export const GET_CLIENT_LIST_QUERY = gql`
query GetClientListQuery {
	clients {
		id
		companyName
		firstName
		surnames
	}
}
`

const AddCompanyForm = () => {
    const [formData, setFormData] = useState({
			clientId: '',
			coName: '',
			address1: '',
			address2: '',
			city: '',
			country: ''
    })
    const [formFile, setFormFile] = useState(null)
    const [error, setError] = useState(null)
		const [clientList, setClientList] = useState([])

    const history = useHistory()

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

    const [uploadFile, {loading}] = useMutation(CO_UPLOAD_DOC_MUTATION, {
      onError: error => setError(error)
    })

    const [createCo] = useMutation(NEW_CO_MUTATION, {
        variables: {
					clientId: formData.clientId,
					coName: formData.coName,
					address1: formData.address1,
					address2: formData.address2,
					city: formData.city,
					country: formData.country
        }, 
        update: (cache, {data: {createCompany: {company}}}) => {
          const { companies } = cache.readQuery({
            query: GET_COMPANIES_QUERY,
            variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_COMPANIES_QUERY,
            variables: {first: resultsPerPage},
            data: {
              companies: [company, ...companies]
            }
          })
        },
        onCompleted: ({createCompany: {company: {id}}}) => {
          uploadFile({variables: {
            coId: id,
            file: formFile
          }})
          history.push(`/companies/${id}`)
        },
        onError: error => {
            setError(error)
        }
    }) 

    const handleChange = (event, name) => {
        setFormData({
          ...formData,
          [name]: event.target.value
        })
    }

    if (loading) return <Loading />

    return (
        <Accordion defaultActiveKey='0' className='w-75 h-100' style={{opacity: 0.85}}>
            <Card bg='dark' text='light' className='d-flex'>
                <Card.Header>
                    <Accordion.Toggle 
                      as={Button} 
                      eventKey='1'
                      className='btn-block'
                      onClick={() => setTimeout(() => window.scrollBy(0, 500), 250)} 
                    >
                        Create New Company
                    </Accordion.Toggle>
                </Card.Header>
                {error && <p className='error-message'>Error creating new company: {error.message}</p>}
                <Accordion.Collapse eventKey='1'>
                    <form 
                      className='p-3' 
                      onSubmit={e => {  
                        e.preventDefault()
                        createCo()
                      }}
                    >
                        <div className='form-row'>
													<ClientDropDown 
														name={'clientId'}
														placeholder={'Client Name'}
														options={clientList}
														handleChange={handleChange}
														req={true}
													/>
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
                            req={true}
                          />
                          <div className='my-2'>
                            <label htmlFor='incorpDoc' className='mr-2'>Certificate of Incorp: </label>
                            <FileInput id='incorpDoc' setFile={setFormFile} />
                          </div>
                        </div>
                        <button type='submit' className='btn btn-light my-3'>Submit</button>
                    </form>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AddCompanyForm