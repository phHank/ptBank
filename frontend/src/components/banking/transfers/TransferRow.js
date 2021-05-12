import React from 'react'

import { useHistory } from 'react-router-dom'

const TransferRow = ({transferData}) => {
    const history = useHistory()

    return (
        <tr style={{cursor: 'pointer'}} onClick={() => undefined /* history.push(`/transfers/${transferData.id}`) */}>
            <td className={transferData.urgent ? 'bg-warning text-dark' : ''} >{transferData.account.accName}</td>
            <td className={transferData.urgent ? 'bg-warning text-dark' : ''} >{transferData.paymentDate}</td>
            <td className={transferData.urgent ? 'bg-warning text-dark' : ''} >{transferData.currency} {transferData.amount}</td>
            <td className={transferData.urgent ? 'bg-warning text-dark' : ''} >{transferData.benifName}</td>
        </tr>
    )
}

export default TransferRow