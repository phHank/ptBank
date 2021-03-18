import React from 'react'

import { useHistory } from 'react-router-dom'

const AccountRow = ({accData}) => {
    const history = useHistory()

    return (
        <tr style={{cursor: 'pointer'}} onClick={() => history.push(`/bank-accounts/${accData.id}`)}
        >
            <td>{accData.accName}</td>
            <td>{accData.currencyCode}</td>
            <td>{accData.iban}</td>
            <td>{accData.swift}</td>
        </tr>
    )
}

export default AccountRow