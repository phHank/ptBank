import React, { useState } from 'react'

import { useHistory } from 'react-router'

import { useMutation, gql } from '@apollo/client'

const LOGIN_MUTATION = gql`
mutation LoginMutation(
    $username: String!
    $password: String!
){
    tokenAuth(username: $username, password:$password) {
      token
      payload
    }
  }
`

const Login = ({setTokenInfo}) => {
    const [formState, setFormState] = useState({
        username: '',
        password: ''
    })
    const [loginError, setLoginError] = useState('')

    const history = useHistory()

    const [logIn] = useMutation(LOGIN_MUTATION, {
        variables: {
            username: formState.username,
            password: formState.password
        },
        onCompleted: ({tokenAuth}) => {
          setTokenInfo(tokenAuth)

          history.location.pathname === '/' 
            ? history.push('/dashboard')
            : history.push(history.location.pathname)
        },
        onError: ({message}) => setLoginError(message) 
    })

    return (
      <>
        {loginError && <p className='error-message'>{loginError}</p>}
        <div className='d-flex align-items-center justify-content-center mt-5 login'>
          <form 
            onSubmit={e => {
              e.preventDefault()
              logIn()
            }}
          >
            <input
              id="username" 
              className='lf--input' 
              placeholder='Username'
              type='text' 
              required="required"
              onChange={e => {
                setFormState({
                    ...formState,
                    username: e.target.value
                })
                setLoginError('')
              }}
              value={formState.username}
            />
            <input
              id="password" 
              className='lf--input'
              type='password' 
              placeholder='Password'
              required="required"
              onChange={e => {
                setFormState({
                    ...formState,
                    password: e.target.value
                })
                setLoginError('')
                }}
              value={formState.password}
              
            />
            <button type="submit" className="btn btn-primary btn-block btn-large">Login</button>
          </form>
        </div>
      </>
    )
}

export default Login