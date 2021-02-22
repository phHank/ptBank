import React, { useState, useEffect } from 'react'
import useInterval from 'use-interval'

import { 
    Switch, 
    Route
} from 'react-router-dom'

import { useMutation, useLazyQuery, gql } from '@apollo/client'

import Login from './Login'
import NotFound from './NotFound'
import Dashboard from './Dashboard'

const REFRESH_TOKEN_MUTATION = gql`
mutation RefreshTokenMutation(
    $token: String!
){
    refreshToken(token: $token) {
      token
      payload
    }
  }
`

export const PROFILE_DATA_QUERY = gql`
query ProfileDataQuery {
    userProfile {
        user {
            id
            firstName
            username
            email
            isStaff
            isSuperuser
        }
        clientProfile {
            id
        }
        g1
        g2
        g3
    }
}
`

export let AUTH_TOKEN

const App = () => {
    const [jwtTokenInfo, setJwtTokenInfo] = useState('')

    const [getProfileData, {data, error}] = useLazyQuery(PROFILE_DATA_QUERY)

    useEffect(() => {
        AUTH_TOKEN = jwtTokenInfo.token
        getProfileData()
    }, [jwtTokenInfo])

    const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION, {
        variables: {
            token: jwtTokenInfo.token,
        },
        onCompleted: ({refreshToken}) => {
            setJwtTokenInfo(refreshToken)
        }
    })

    useInterval(() => {
        if (jwtTokenInfo.token) {
            const orderRefreshToken = jwtTokenInfo.payload.exp - Math.floor(Date.now() / 1000) < 30
            if (orderRefreshToken) refreshToken()
        }
    }, 15000)

    if (!jwtTokenInfo.token) return <Login setTokenInfo={setJwtTokenInfo} />

    return (
        <>
            {error && <p className='error-message'>Error getting profile data: {error.message}</p>}
            {!data?.userProfile && <p className='error-message'>Profile not found!</p>}
            <Switch>
                <Route 
                exact 
                path='/login' 
                render={() => <Login setTokenInfo={setJwtTokenInfo} />}
                />
                <Route 
                exact 
                path='/dashboard' 
                render={() => <Dashboard userProfile={data} />} 
                />
                <Route component={NotFound} />
            </Switch>
        </>
    )
}


export default App