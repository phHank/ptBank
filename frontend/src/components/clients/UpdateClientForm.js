import React, { useState } from 'react'

import { useMutation, gql } from '@apollo/client'
import { GET_CLIENTS_QUERY } from './ClientList'

import Card from 'react-bootstrap/Card'

import Loading from '../Loading'
import TextInput from '../forms/TextInput'
import SelectInput from '../forms/SelectInput'

import { titleList, genderList, countryList } from '../../utils/constants'

const UPDATE_CLIENT_MUTATION = gql`
mutation UpdateClientMutation (
    $id: Int!
    $companyName: String!
    $firstName: String!
    $surnames: String!
    $title: String!
    $gender: String!
    $phone: String!
    $email: String!
    $country: String!
) {
  updateClientProfile (
    clientProfileId: $id
    companyName: $companyName
    firstName: $firstName
    surnames: $surnames
    title: $title
    gender: $gender
    phone: $phone
    email: $email
    country: $country
  ) {
    clientProfile {
      id
      companyName
      firstName
      surnames
      title
      gender
      phone
      email
      country
    }
  }
}
`


const UpdateClientForm = ({clientData, setEdit}) => {
    const [formData, setFormData] = useState({
        companyName: clientData.companyName,
        firstName: clientData.firstName,
        surnames: clientData.surnames,
        title: clientData.title,
        gender: clientData.gender,
        email: clientData.email,
        phone: clientData.phone,
        country: clientData.country
    })

    const [updateClient, {loading, error}] = useMutation(UPDATE_CLIENT_MUTATION, {
        variables: {
            id: clientData?.id,
            companyName: formData.companyName,
            firstName: formData.firstName,
            surnames: formData.surnames,
            title: formData.title,
            gender: formData.gender,
            email: formData.email,
            phone: formData.phone,
            country: formData.country
        },
        update: (cache, {data: {updateClientProfile}}) => {
            const {clientProfile} = updateClientProfile
            
            const {clients} = cache.readQuery({
                query: GET_CLIENTS_QUERY,
                variables: {
                    clientId: clientData.id
                }
            })

            cache.writeQuery({
                query: GET_CLIENTS_QUERY,
                data: {
                    clients: clients.map(client => (
                        client.id === clientData.id
                          ? clientProfile
                          : client
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
        <Card bg='dark' text='light' className='m-3 p-3'>
            <form 
              className='d-flex flex-column' 
              onSubmit={e => {
                e.preventDefault()
                updateClient()
              }}
            >
                {error && <p className='error-message'>Error updating client profile: {error.message}</p>}
                <TextInput 
                    name={'companyName'}
                    placeholder={'Company Ltd'} 
                    value={formData.companyName} 
                    handleChange={handleChange}
                    req={true}
                />
                <SelectInput 
                    name={'title'}
                    options={titleList}
                    handleChange={handleChange}
                    req={true}
                    defaultVal={formData.title}
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
                    defaultVal={formData.gender}
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
                    defaultVal={formData.country}
                />
                <div className='d-flex w-100 justify-content-end'>
                    <button type='submit' className='btn btn-sm btn-primary'>Submit</button>
                    <button className='btn btn-sm btn-light mx-1' onClick={() => setEdit(false)}>Cancel</button>
                </div>
            </form>
        </Card>
    )
}

export default UpdateClientForm