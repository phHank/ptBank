import React, { useState } from 'react'

import { useHistory }from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import { genderList, titleList, countryList, resultsPerPage } from '../../utils/constants'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Loading from '../Loading'
import TextInput from '../forms/TextInput'
import SelectInput from '../forms/SelectInput' 
import FileInput from '../forms/FileInput'
import { GET_CLIENTS_QUERY } from './ClientList'

export const NEW_CLIENT_MUTATION = gql`
mutation NewClientMutation (
    $firstName: String
    $surnames: String
    $companyName: String
    $gender: String
    $title: String
    $email: String!
    $phone:  String
    $country: String!
){
    createClientProfile (
      firstName: $firstName
      surnames: $surnames
      companyName: $companyName
      gender: $gender
      title: $title
      email: $email
      phone: $phone
      country: $country
    ) {
    clientProfile {
        id
        companyName
        email
        phone
        firstName
        surnames
        country
        gender
        title
        incorpCert
        uploadDate
        createdBy {
          username
        }
        dateCreated
        updatedBy {
          username
        }
        lastUpdated
        }
    }
  }
`

export const CLIENT_UPLOAD_DOC_MUTATION = gql`
mutation ClientUploadDocMutation (
  $clientId: Int!
  $file: Upload!
) {
  clientUpload(clientId: $clientId, file: $file) {
    client {
      id
      incorpCert
      uploadDate
    }
    success
  }
}
`

const AddClientForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        surnames: '',
        companyName: '',
        gender: '',
        title: '',
        email: '',
        phone: '',
        country: ''
    })
    const [formFile, setFormFile] = useState({})
    const [error, setError] = useState(null)

    const history = useHistory()

    const [uploadFile, {loading}] = useMutation(CLIENT_UPLOAD_DOC_MUTATION, {
      onError: error => {
        setError(error)
      }
    })

    const [createClient] = useMutation(NEW_CLIENT_MUTATION, {
        variables: {
            firstName: formData.firstName,
            surnames: formData.surnames,
            companyName: formData.companyName,
            gender: formData.gender,
            title: formData.title,
            email: formData.email,
            phone:  formData.phone,
            country: formData.country
        }, 
        update: (cache, {data: {createClientProfile}}) => {
          const {clientProfile} = createClientProfile

          const { clients } = cache.readQuery({
            query: GET_CLIENTS_QUERY,
            variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_CLIENTS_QUERY,
            variables: {first: resultsPerPage},
            data: {
              clients: [clientProfile, ...clients]
            }
          })
        },
        onCompleted: ({createClientProfile}) => {
          uploadFile({variables: {
            clientId: createClientProfile.clientProfile.id,
            file: formFile
          }})
          history.push(`/clients/${createClientProfile.clientProfile.id}`)
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
                        Create New Client
                    </Accordion.Toggle>
                </Card.Header>
                {error && <p className='error-message'>Error creating new client profile: {error.message}</p>}
                <Accordion.Collapse eventKey='1'>
                    <form 
                      className='p-3' 
                      onSubmit={e => {  
                        e.preventDefault()
                        if (!formData.companyName && !(formData.firstName && formData.surnames)) {
                            setError({message: "You must provide either a company or personal name!"})
                            return
                        }
                        createClient()
                      }}
                    >
                        <div className='form-row'>
                          <TextInput 
                            name={'companyName'}
                            placeholder={'Company Ltd'} 
                            value={formData.companyName} 
                            handleChange={handleChange}
                          />
                          <SelectInput 
                            name={'title'}
                            options={titleList}
                            handleChange={handleChange}
                            req={true}
                          />
                          <div className='row'>
                            <TextInput 
                              name={'firstName'} 
                              placeholder={'First Name'} 
                              value={formData.firstName} 
                              handleChange={handleChange}
                            />
                            <TextInput 
                              name={'surnames'} 
                              placeholder={'Second Name(s)'} 
                              value={formData.surnames} 
                              handleChange={handleChange}
                            />
                          </div>
                          <SelectInput 
                            name={'gender'}
                            options={genderList}
                            handleChange={handleChange}
                            req={true}
                          />
                          <div className='row'>
                            <TextInput 
                              name={'email'} 
                              type={'email'}
                              placeholder={'example@email.ie'} 
                              value={formData.email} 
                              handleChange={handleChange}
                              req={true}
                            />
                            <TextInput 
                              name={'phone'} 
                              placeholder={'+353 123 4567'} 
                              value={formData.phone} 
                              handleChange={handleChange}
                              req={true}
                            />
                          </div>
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

export default AddClientForm