import React, { useState, useEffect } from 'react'
import useInterval from 'use-interval'

import { 
    Switch, 
    Route
} from 'react-router-dom'

import { useMutation, useLazyQuery, gql } from '@apollo/client'

import Nav from './Nav'
import Login from './Login'
import NotFound from './NotFound'
import Dashboard from './Dashboard'
import ClientList from './clients/ClientList'
import CompanyList from './companies/CompanyList'
import BankDashboard from './banking/BankDashboard'
import Footer from './Footer'

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

    if (!jwtTokenInfo.token || jwtTokenInfo.payload.exp < Math.floor(Date.now() / 1000)) {
        return <Login setTokenInfo={setJwtTokenInfo} />
    }
    
    return (
        <>
            <Nav firstName={data?.userProfile[0].user.firstName}/>
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
                render={() => <Dashboard profileData={data?.userProfile[0]} />} 
                />
                <Route exact path='/clients' component={ClientList} />
                <Route exact path='/companies' component={CompanyList} />
                <Route exact path='/banking' component={BankDashboard} />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </>
    )
}


export default App