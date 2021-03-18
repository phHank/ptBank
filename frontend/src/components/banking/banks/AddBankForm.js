import React, { useState } from 'react'

import { useHistory }from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import { countryList, resultsPerPage } from '../../../utils/constants'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Loading from '../../Loading'
import TextInput from '../../forms/TextInput'
import SelectInput from '../../forms/SelectInput' 
import { GET_BANKS_QUERY } from './BankList'

export const NEW_BANK_MUTATION = gql`
mutation NewBankMutation (
    $name: String!
    $country: String!
){
    createBank (
      name: $name
      country: $country
    ) {
    bank {
        id
        name
        country
    }
  }
}
`

const AddBankForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        country: ''
    })
    const [error, setError] = useState(null)

    const history = useHistory()

    const [createBank, {loading}] = useMutation(NEW_BANK_MUTATION, {
        variables: {
            name: formData.name,
            country: formData.country
        }, 
        update: (cache, {data: {createBank: {bank}}}) => {
          const { banks } = cache.readQuery({
            query: GET_BANKS_QUERY,
            // variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_BANKS_QUERY,
            // variables: {first: resultsPerPage},
            data: {
              banks: [bank, ...banks]
            }
          })
        },
        onCompleted: ({createBank}) => {
          history.push(`/banks/${createBank.bank.id}`)
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
                        Add New Bank
                    </Accordion.Toggle>
                </Card.Header>
                {error && <p className='error-message'>Error creating new bank: {error.message}</p>}
                <Accordion.Collapse eventKey='1'>
                    <form 
                      className='p-3' 
                      onSubmit={e => {  
                        e.preventDefault()
                        createBank()
                      }}
                    >
                        <div className='form-row'>
                          <TextInput 
                            name={'name'}
                            placeholder={'Bank Name'} 
                            value={formData.name} 
                            handleChange={handleChange}
                            req={true}
                          />
                          <SelectInput 
                            name={'country'}
                            options={countryList}
                            handleChange={handleChange}
                            req={true}
                          />
                        </div>
                        <button type='submit' className='btn btn-light my-3'>Submit</button>
                    </form>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AddBankForm