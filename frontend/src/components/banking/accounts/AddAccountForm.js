import React, { useState } from 'react'

// import { useHistory } from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import { currencyList, resultsPerPage } from '../../../utils/constants'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Loading from '../../Loading'
import SelectCompany from './SelectCompany'
import SelectBank from './SelectBank'
import TextInput from '../../forms/TextInput'
import SelectInput from '../../forms/SelectInput'
import SortCodeInput from './SortCodeInput'
import { GET_ACCOUNTS_QUERY } from './AccountList'

export const NEW_ACCOUNT_MUTATION = gql`
mutation NewAccountMutation (
    $coId: Int!
    $bankId: Int!
    $accName: String!
    $iban: String
    $swift: String
    $accountNo: String
    $sortCode: Int
    $currencyCode: String!
){
    createBankAcc (
        coId: $coId
        bankId: $bankId
        accName: $accName
        iban: $iban
        swift: $swift
        accountNo: $accountNo
        sortCode: $sortCode
        currencyCode: $currencyCode
    ) {
    bankAcc {
        id
        accName
        iban
        swift
        accountNo
        sortCode
        currencyCode
        company {
            id
            coName
        }
        bank {
            id
            name
        }
    }
  }
}
`

const AddBankForm = () => {
    const [formData, setFormData] = useState({
        accName: '',
        iban: '',
        swift: '',
        accNo: '',
        sortCode: ['X', 'X', 'X'],
        currencyCode: 'EUR',
        coId: '',
        bankId: ''
    })
    const [error, setError] = useState(null)

    // const history = useHistory()

    const [createBankAcc, {loading}] = useMutation(NEW_ACCOUNT_MUTATION, {
        variables: {
            accName: formData.accName,
            iban: formData.iban,
            swift: formData.swift,
            accountNo: formData.accNo,
            sortCode: formData.sortCode.map(n => n < 10 ? `0${n}` : n).join(''),
            currencyCode: formData.currencyCode,
            coId: formData.coId,
            bankId: formData.bankId
        }, 
        update: (cache, {data: {createBankAcc: {bankAcc}}}) => {
          const { bankAccounts } = cache.readQuery({
            query: GET_ACCOUNTS_QUERY,
            variables: {first: resultsPerPage}
          })

          cache.writeQuery({
            query: GET_ACCOUNTS_QUERY,
            variables: {first: resultsPerPage},
            data: {
              bankAccounts: [bankAcc, ...bankAccounts]
            }
          })
        },
        // onCompleted: ({createBankAcc}) => {
        //   history.push(`/bank-accounts/${createBankAcc.bankAcc.id}`)
        // },
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
                        Add New Bank Account
                    </Accordion.Toggle>
                </Card.Header>
                {error && <p className='error-message'>Error creating new bank account: {error.message}</p>}
                <Accordion.Collapse eventKey='1'>
                    <form
                      className='p-3'
                      onSubmit={e => {
                        e.preventDefault()
                        createBankAcc()
                      }}
                    >
                        <div className='form-row'>

                          <SelectCompany setFormData={setFormData} formData={formData} />

                          <SelectBank setFormData={setFormData} formData={formData} />

                          <TextInput 
                            name={'accName'}
                            placeholder={'Account Name'} 
                            value={formData.name} 
                            handleChange={handleChange}
                            req={true}
                          />

                          <SelectInput 
                            name={'currencyCode'}
                            options={currencyList}
                            defaultVal='EUR'
                            handleChange={handleChange}
                            req={true}
                          />

                          <TextInput 
                            name={'iban'}
                            placeholder={'IE12PEAR1234561234567'}
                            value={formData.iban} 
                            handleChange={handleChange}
                          />

                          <TextInput 
                            name={'swift'}
                            placeholder={'ABCDEFXXX'}
                            value={formData.swift}
                            handleChange={handleChange}
                          />

                          <TextInput 
                            name={'accNo'}
                            placeholder={'1234567'}
                            value={formData.accNo}
                            handleChange={handleChange}
                          />

                          <SortCodeInput setFormData={setFormData} formData={formData} />

                        </div>
                        <button type='submit' className='btn btn-light my-3'>Submit</button>
                    </form>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AddBankForm