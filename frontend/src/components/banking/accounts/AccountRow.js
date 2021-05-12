import React from 'react'

const AccountRow = ({accData}) => {
    return (
        <tr style={{cursor: 'pointer'}} onClick={() => undefined /* () => history.push(`/bank-accounts/${accData.id}`) */} 
        >
            <td>{accData.accName}</td>
            <td>{accData.currencyCode}</td>
            <td>{accData.iban}</td>
            <td>{accData.swift}</td>
        </tr>
    )
}

export default AccountRow