import React, { useState } from 'react'

// import { useHistory }from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'

import Loading from '../../Loading'
import SelectDebitAccount from './SelectDebitAccount'
import AmountInput from './AmountInput'
import TextInput from '../../forms/TextInput'
import UrgentTransfer from './UrgentTransfer'
import { GET_TRANSFERS, currentMonth, currentYear } from './TransferList'

export const NEW_TRANSFER_MUTATION = gql`
mutation NewTransferMutation (
    $amount: Float!
    $currency: String!
    $bankAccId: Int!
    $benifAccountNo: String!
    $benifName: String!
    $benifSwift: String!
    $paymentRef: String!
    $securityPhrase: String!
    $urgent: Boolean
){
    createTransfer(
        amount: $amount
        currency: $currency
        bankAccId: $bankAccId
        benifAccountNo: $benifAccountNo
        benifName: $benifName
        benifSwift: $benifSwift
        paymentRef: $paymentRef
        securityPhrase: $securityPhrase
        urgent: $urgent
        ) {
      transfer {
        id
        paymentDate
        urgent
        currency
        amount
        benifName
        account {
          accName
        }
      }
    }
  }
`

const AddTransferForm = () => {
    const [formData, setFormData] = useState({
        amount: 0.00,
        currency: 'EUR',
        bankAccId: '',
        benifAccountNo: '',
        benifName: '',
        benifSwift: '',
        paymentRef: '',
        securityPhrase: '',
        urgent: false,
    })
    const [error, setError] = useState(null)

    // const history = useHistory()

    const [createTransfer, {loading}] = useMutation(NEW_TRANSFER_MUTATION, {
        variables: {
            amount: formData.amount,
            currency: formData.currency,
            bankAccId: formData.bankAccId,
            benifAccountNo: formData.benifAccountNo,
            benifName: formData.benifName,
            benifSwift: formData.benifSwift,
            paymentRef: formData.paymentRef,
            securityPhrase: formData.securityPhrase,
            urgent: formData.urgent
        }, 
        update: (cache, {data: {createTransfer: {transfer}}}) => {
          const { transfers } = cache.readQuery({
            query: GET_TRANSFERS,
            variables: {
                month: currentMonth,
                year: currentYear
            }
          })

          cache.writeQuery({
            query: GET_TRANSFERS,
            variables: {
                month: currentMonth,
                year: currentYear
            },
            data: {
              transfers: [transfer, ...transfers]
            }
          })
        },
        // onCompleted: ({createTransfer: {transfer}}) => {
        //   history.push(`/transfers/${transfer.id}`)
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

    const handleAccountSelect = (event) => {
        const [bankAccId, currency] = event.target.value.split(';')

        setFormData({
            ...formData,
            bankAccId,
            currency
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
                        New Transfer
                    </Accordion.Toggle>
                </Card.Header>
                {error && <p className='error-message'>Error creating new transfer: {error.message}</p>}
                <Accordion.Collapse eventKey='1'>
                    <form 
                      className='p-3' 
                      onSubmit={e => {  
                        e.preventDefault()
                        createTransfer()
                      }}
                    >
                        <div className='form-row'>

                          <SelectDebitAccount handleAccountSelect={handleAccountSelect} />

                          <AmountInput handleChange={handleChange} formData={formData} />
                          
                          <TextInput 
                            name={'benifName'}
                            placeholder={'Account Holder Name'} 
                            value={formData.benifName} 
                            handleChange={handleChange}
                            req={true}
                          />

                          <TextInput 
                            name={'benifAccountNo'}
                            placeholder={'IBAN or Account No.'} 
                            value={formData.benifAccountNo} 
                            handleChange={handleChange}
                            req={true}
                          />

                          <TextInput 
                            name={'benifSwift'}
                            placeholder={'SWIFT/BIC or NSC or routing number'} 
                            value={formData.benifSwift} 
                            handleChange={handleChange}
                            req={true}
                          />

                          <TextInput 
                            name={'paymentRef'}
                            placeholder={'Invoice Number or Licence Agreement'} 
                            value={formData.paymentRef} 
                            handleChange={handleChange}
                            req={true}
                          />

                          <TextInput 
                            name={'securityPhrase'}
                            placeholder={'Next Phrase On Your List'} 
                            value={formData.securityPhrase}
                            handleChange={handleChange}
                            req={true}
                          />

                          <UrgentTransfer setFormData={setFormData} formData={formData} />

                        </div>
                        <button type='submit' className='btn btn-light my-3'>Submit</button>
                    </form>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
}

export default AddTransferForm