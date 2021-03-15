import React from 'react'

import { getDateTime } from '../../utils/helpers'

const CompanyCardFooter = ({lastUpdated, username}) => (
    <div className='d-flex justify-content-center pt-1 mt-1 border-top border-secondary'>
        <small className='text-muted'>
            Last updated {getDateTime(new Date(lastUpdated))} by {username}.
        </small>
    </div>
)

export default CompanyCardFooter