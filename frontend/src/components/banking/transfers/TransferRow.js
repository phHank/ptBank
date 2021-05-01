import React from 'react'

import { useHistory } from 'react-router-dom'

const TransferRow = ({transferData}) => {
    const history = useHistory()

    return (
        <tr style={{cursor: 'pointer'}} onClick={() => history.push(`/transfers/${transferData.id}`)}
        >
            <td>{transferData.account.accName}</td>
            <td>{transferData.paymentDate}</td>
            <td>{transferData.currency} {transferData.amount}</td>
            <td>{transferData.benifName}</td>
        </tr>
    )
}

export default TransferRow