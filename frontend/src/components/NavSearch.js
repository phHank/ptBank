import React, { useState } from 'react'

import { useLocation, useHistory } from 'react-router'

import { useApolloClient } from '@apollo/client'
import { GET_CLIENTS_QUERY } from './clients/ClientList'
import { GET_COMPANIES_QUERY } from './companies/CompanyList'
import { GET_BANKS_QUERY } from './banking/banks/BankList'
import { GET_ACCOUNTS_QUERY } from './banking/accounts/AccountList'
import { GET_TRANSFERS } from './banking/transfers/TransferList'

const NavSearch = () => {
    const [query, setQuery] = useState('')
    const [error, setError] = useState(null)

    const location = useLocation()
    const history = useHistory()

    const client = useApolloClient()

    const searchTargets = {
        clients: GET_CLIENTS_QUERY, 
        companies: GET_COMPANIES_QUERY,
        banks: GET_BANKS_QUERY,
        'bank-accounts': GET_ACCOUNTS_QUERY,
        transfers: GET_TRANSFERS,
    }

    const [,target] = location.pathname.split('/')

    const searchables = ['clients', 'companies', 'banks', 'transfers', 'bank-accounts']

    return (
        searchables.includes(target) && (
            <form onSubmit={async e => {
                    e.preventDefault()
                    const { data, error } = await client.query({
                        query: searchTargets[target],
                        variables: { search: query }
                    })
                    if (error) {
                        setError(error)
                        return
                    }
                    setQuery('')
                    history.push({
                        pathname: `/${target}`,
                        searchData: data
                    })
                }}
            >
                {error && <p className='error-message'>Error performing search: {error.message}</p>}
                <input 
                  className='bg-light text-dark' 
                  placeholder={target.toUpperCase()} 
                  type='text'
                  value={query}
                  onChange={e => setQuery(e.target.value)} 
                />
                <button 
                  className='btn btn-light'
                  type='submit'
                  disabled={!query.trim()}
                  style={{opacity:!query.trim() ? 0 : 1 }}
                >
                    Search
                </button>
            </form>
        )
    )
}

export default NavSearch