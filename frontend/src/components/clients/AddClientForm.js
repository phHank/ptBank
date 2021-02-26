import React, { useState } from 'react'

import { useMutation, gql } from '@apollo/client'

import { genderList, titleList, countryList } from '../../utils/constants'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'


export const NEW_CLIENT_MUTATION = gql`
mutation NewClientMutation (
    $firstName: String
    $surnames: String
    $companyName: String
    $gender: String!
    $title: String
    $email: String!
    $phone:  String!
){
    createClientProfile (
      firstName: $firstName
      surnames: $surnames
      companyName: $companyName
      gender: $gender
      title: $title
      email: $email
      phone: $phone
    ) {
        clientProfile {
        id
        email
        firstName
        surnames
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

const AddClientForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        surnames: '',
        companyName: '',
        gender: '',
        title: '',
        email: '',
        phone: ''
    })

    //TODO useMutation to create new client profile. 

    //TODO create components for each input type below. 

    return (
        <Accordion defaultActiveKey='0' className='w-75 h-100' style={{opacity: 0.75}}>
            <Card bg='dark' text='light' className='d-flex'>
                <Card.Header>
                    <Accordion.Toggle as={Button} eventKey='1'>
                        Create New Client
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey='1'>
                    <form className='p-3' onSubmit={e => e.preventDefault()}>
                        <div className='form-row'>
                            <div className='form-group col-md-6'>
                                <label htmlFor='coName'>Company**</label>
                                <input type='text' className='form-control' id='coName' placeholder='Company Ltd' />
                            </div>
                            <div className='form-group col-md-6'>
                                <label htmlFor='firstName'>First Name**</label>
                                <input type='text' className='form-control' id='firstName' placeholder='First Name' />
                            </div>
                            <div className='form-group col-md-6'>
                                <label htmlFor='surnames'>Surname(s)**</label>
                                <input type='text' className='form-control' id='surnames' placeholder='Second Name(s)' />
                            </div>
                            <small>** company or name must be provided</small>
                            <div className='form-group col-md-4'>
                                <label htmlFor='inputGender'>Gender</label>
                                <select id='inputGender' className='form-control' defaultValue='choose'>
                                    <option value='choose' disabled>Genders...</option>
                                    <option value='Male' disabled>Female</option>
                                    <option value='Female' disabled>Male</option>
                                    <option value='Other' disabled>Other</option>
                                </select>
                            </div>
                            <div className='form-group col-md-4'>
                                <label htmlFor='inputTitle'>Title</label>
                                <select id='inputTitle' className='form-control' defaultValue='title'>
                                    <option value='title' disabled>Title...</option>
                                    <option value='Male' disabled>Ms</option>
                                    <option value='Female' disabled>Mrs</option>
                                    <option value='Other' disabled>Mr</option>
                                </select>
                            </div>
                            <div className='form-group col-md-6'>
                                <label htmlFor='email'>Email*</label>
                                <input type='email' className='form-control' id='email' placeholder='example@example.com' />
                            </div>
                            <div className='form-group col-md-6'>
                                <label htmlFor='text'>Phone*</label>
                                <input type='text' className='form-control' id='email' placeholder='+353 123 4567' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='inputAddress'>Address</label>
                            <input type='text' className='form-control' id='inputAddress' placeholder='1234 O&#39;Connel Street'/>
                        </div>
                        <div className='form-group'>
                            <input type='text' className='form-control' id='inputAddress2' placeholder='' />
                        </div>
                        <div className='form-row'>
                            <div className='form-group col-md-6'>
                                <label htmlFor='inputCity'>City</label>
                                <input type='text' className='form-control' id='inputCity' />
                            </div>
                            <div className='form-group col-md-4'>
                                <label htmlFor='inputCountry'>Country</label>
                                <select id='inputCountry' className='form-control' defaultValue='Ireland'>
                                    {countryList.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group col-md-2'>
                                <label htmlFor='inputZip'>Post/Zip Code</label>
                                <input type='text' className='form-control' id='inputZip' />
                            </div>
                        </div>
                        <div className='form-group'>
                            <div className='form-check'>
                                <input className='form-check-input' type='checkbox' id='gridCheck' />
                                <label className='form-check-label' htmlFor='gridCheck'>
                                    Check me out
                                </label>
                            </div>
                        </div>
                        <button type='submit' className='btn btn-light mt-2'>Submit</button>
                    </form>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AddClientForm