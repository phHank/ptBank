import React, { useState, useEffect } from 'react'
import useInterval from 'use-interval'

import { 
    Switch, 
    Route
} from 'react-router-dom'

import { useMutation, gql } from '@apollo/client'

import Login from './Login'
import NotFound from './NotFound'
import Dashboard from './Dashboard'

export const CHECK_TOKEN_EXPIRY_MUTATION = gql`
mutation CheckTokenExpiryMutation(
    $token: String!
) {
    verifyToken(token: $token) {
        payload
    }
}
`

export const REFRESH_TOKEN_MUTATION = gql`
mutation RefreshTokenMutation(
    $token: String!
){
    refreshToken(token: $token) {
      token
      refreshExpiresIn
    }
  }
`

export let AUTH_TOKEN

const App = () => {
    const [jwtToken, setJwtToken] = useState('')
    const [tokenPayload, setTokenPayload] = useState({})

    const [getTokenPayload] = useMutation(CHECK_TOKEN_EXPIRY_MUTATION, {
        variables: {
            token: jwtToken
        }, 
        onCompleted: ({verifyToken}) => {
            setTokenPayload(verifyToken.payload)
        }
    })

    useEffect(() => {
        if (jwtToken) getTokenPayload()
        AUTH_TOKEN = jwtToken
    }, [jwtToken])

    const [refreshToken] = useMutation(REFRESH_TOKEN_MUTATION, {
        variables: {
            token: jwtToken,
        },
        onCompleted: ({refreshToken}) => {
          setJwtToken(refreshToken.token)
        }
    })

    useInterval(() => {
        const orderRefreshToken = tokenPayload.exp - Math.floor(Date.now() / 1000) < 30
        if (jwtToken && orderRefreshToken) {
            refreshToken()
        }
    }, 15000)

    if (!jwtToken) return <Login setToken={setJwtToken} />

    return (
        <Switch>
            <Route 
              exact 
              path='/login' 
              render={() => <Login setToken={setJwtToken} />}
            />
            <Route 
              exact 
              path='/dashboard' 
              render={() => <Dashboard user={tokenPayload.username}/>} 
            />
            <Route component={NotFound} />
        </Switch>
    )
}


export default App