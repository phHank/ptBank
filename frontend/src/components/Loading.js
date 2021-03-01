import React from 'react'

import Spinner from 'react-bootstrap/Spinner'

const Loading = () => (
    <div className='d-flex w-100 h-100 justify-content-center'>
        <Spinner animation="border" role="status" variant="primary" />
    </div>
)

export default Loading