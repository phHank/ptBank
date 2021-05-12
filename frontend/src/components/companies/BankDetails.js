import React from 'react'

const BankDetails = ({bankData}) => {
    return (
        <div>
            <h5 className='w-100 text-center'><u>Recent Banking Activity</u></h5>
            <ul>
                {bankData.map(acc => (
                    <li key={acc.id}>
                        {acc.accName} {acc.currencyCode} | {acc.bank.name}
                        
                        {acc.transfers.length > 0 
                            ? (
                            <div>
                                {acc.transfers.slice(0,5).map(tr => (
                                    <small className='d-block bg-secondary mt-1 mr-5 p-1 rounded' key={tr.id}>
                                        {tr.currency} {tr.amount} to {tr.benifName} for payment on {tr.paymentDate}
                                    </small>
                                ))}
                            </div>) 
                            : (<small className='d-block'>No transfers for this account</small>) 
                        }
                    </li>
                    
                ))}
            </ul>
        </div>
    )
}

export default BankDetails