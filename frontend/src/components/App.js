import React, { useState, useEffect } from 'react'
import useInterval from 'use-interval'

import { Switch, Route } from 'react-router-dom'

import { useMutation, useLazyQuery, gql } from '@apollo/client'

import Nav from './Nav'
import Login from './Login'
import Loading from './Loading'
import Dashboard from './Dashboard'
import ClientList from './clients/ClientList'
import ClientProfile from './clients/ClientProfile'
import CompanyList from './companies/CompanyList'
import CompanyProfile from './companies/CompanyProfile'
import BankDashboard from './banking/BankDashboard'
import BankList from './banking/banks/BankList'
import AccountList from './banking/accounts/AccountList'
import TransferList from './banking/transfers/TransferList'
import NotFound from './NotFound'
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

    const [getProfileData, {data, error, loading}] = useLazyQuery(PROFILE_DATA_QUERY)

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
    
    if (loading) return <Loading />

    return (
        <>
            <Nav profileData={data?.userProfile[0]}/>
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
                  path='/'
                  render={() => <Dashboard profileData={data?.userProfile[0]} />}
                />
                <Route exact path='/clients' component={ClientList} />
                <Route 
                  exact
				          path='/clients/:id'
                  // TODO: change g3 to g2
				          render={() => <ClientProfile g2={data?.userProfile[0].g3} />} 
				        />
                <Route exact path='/companies' component={CompanyList} />
                <Route 
                  exact
				          path='/companies/:id'
                  // TODO: change g3 to g2
				          render={() => <CompanyProfile g2={data?.userProfile[0].g3} />} 
				        />
                <Route 
                  exact 
                  path='/banking' 
                  render={() => <BankDashboard profileData={data?.userProfile[0]} />} 
                />
                <Route 
                  exact 
                  path='/banks' 
                  render={() => <BankList g3={data?.userProfile[0].g3} />} 
                />
                <Route 
                  exact
                  path='/bank-accounts'
                  render={() => <AccountList g3={data?.userProfile[0].g3} /> }
                />
                <Route 
                  exact
                  path='/transfers'
                  render={() => <TransferList g3={data?.userProfile[0].g3} /> }
                />
                <Route component={NotFound} />
            </Switch>
            <Footer />
        </>
    )
}


export default App