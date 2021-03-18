import React from 'react'

import { useHistory } from 'react-router-dom'

const BankRow = ({bankData}) => {
    const history = useHistory()

    return (
        <tr style={{cursor: 'pointer'}} onClick={() => history.push(`/banks/${bankData.id}`)}
        >
            <td>{bankData.name}</td>
            <td>{bankData.country}</td>
        </tr>
    )
}

export default BankRow