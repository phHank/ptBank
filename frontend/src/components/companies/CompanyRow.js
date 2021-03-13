import React from 'react'

import { useHistory } from 'react-router-dom'

const CompanyRow = ({coData}) => {
    const history = useHistory()

    return (
        <tr style={{cursor: 'pointer'}} onClick={() => history.push(`/companies/${coData.id}`)}
        >
            <td>{coData.coName}</td>
            <td>{coData.city}</td>
            <td>{coData.country}</td>
            <td>{coData.updatedBy.username}</td>
        </tr>
    )
}

export default CompanyRow