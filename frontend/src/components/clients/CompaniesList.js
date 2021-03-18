import React from 'react'

import { Link } from 'react-router-dom'

import { linkStyle } from '../../utils/constants'

const CompaniesList = ({companies}) => (
    <div className='d-flex flex-row'>
        <p>{companies.length > 1 ? 'Companies:' : 'Company:'}</p>
        <div className='d-flex flex-column'>
            {companies.map(company => (
                company.deleted 
                    ? <p key={company.id} className='text-muted mx-1'>{company.coName} {company.deleted && ('(deleted)')}</p>
                    : <Link 
                        key={company.id} 
                        to={`/companies/${company.id}`} 
                        style={linkStyle}
                      >
                        {company.coName} {company.deleted && ('(deleted)')}
                      </Link>
            ))}
        </div>
    </div>
)

export default CompaniesList