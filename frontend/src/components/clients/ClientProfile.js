import React from 'react'

import { useHistory } from 'react-router-dom'

const ClientProfile = () => {
    const history = useHistory()

    if (!history.location.clientData) {
        //TODO useQuery to retrieve relevant client data using id in pathname.
        return <div>useQuery</div> 
    }

    return (
        <div>{JSON.stringify(history.location.clientData)}</div>
    )
}

export default ClientProfile