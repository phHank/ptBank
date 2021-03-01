import React, { useState }from 'react'

import { useLocation, useHistory } from 'react-router'

import { useLazyQuery } from '@apollo/client'
import { GET_CLIENTS_QUERY } from './clients/ClientList'

import Loading from './Loading'

const NavSearch = () => {
    const [query, setQuery] = useState('')
    const location = useLocation()
    const history = useHistory()

    const searchTargets = {
        clients: GET_CLIENTS_QUERY
    }

    const [,target] = location.pathname.split('/')

    const [performSearch, { loading, error }] = useLazyQuery(
        target 
          ? searchTargets[target] 
          : GET_CLIENTS_QUERY
        , { 
            fetchPolicy: 'network-only', 
            onCompleted: data => {
                setQuery('')
                history.push({
                    pathname: `/${target}`,
                    searchData: data
                })
            }
        })

    if (loading) return <Loading />

    return (
        location.pathname !== '/' && (
            <form onSubmit={e => {
                    e.preventDefault()
                    performSearch({variables: {search: query}})
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
                >
                    Search
                </button>
            </form>
        )
    )
}

export default NavSearch