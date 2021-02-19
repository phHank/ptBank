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
    }
  }
`

const Login = () => {
    const [formState, setFormState] = useState({
        username: '',
        password: ''
    })

    const history = useHistory()

    const [logIn] = useMutation(LOGIN_MUTATION, {
        variables: {
            username: formState.username,
            password: formState.password
        },
        onCompleted: ({tokenAuth}) => {
          // TODO: tokenAuth.token: store token locally for authentication: use HttpOnly Cookie. 
          history.push('/')
        }
    })

    return (
        <div>
        <form onSubmit={e => {
            e.preventDefault()
            logIn()
        }
        }>
            <input
              type='text' 
              placeholder='Username'
              onChange={e => {
                setFormState({
                    ...formState,
                    username: e.target.value
                })
                }}
              value={formState.username}
              />
            <input
              type='password' 
              placeholder='Password'
              onChange={e => {
                setFormState({
                    ...formState,
                    password: e.target.value
                })
                }}
              value={formState.password}
              />
            <button type='submit'>Enter</button>
        </form>
        </div>
    )
}

export default Login