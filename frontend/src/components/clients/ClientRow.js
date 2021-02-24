import React from 'react'

import { useHistory } from 'react-router-dom'

const ClientRow = ({clientData}) => {
    const history = useHistory()

    return (
        <tr onClick={() => history.push({
            pathname: `/clients/${clientData.id}`,
            clientData
            })}
        >
            <td>{clientData.companyName ? clientData.companyName : 'N/A'}</td>
            <td>{clientData.firstName ? clientData.firstName : 'N/A'}</td>
            <td>{clientData.surnames ? clientData.surnames : 'N/A'}</td>
            <td>{clientData.updatedBy.username}</td>
        </tr>
    )
}

export default ClientRow