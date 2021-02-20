import React, { useState } from 'react'

import { useHistory } from 'react-router'

import { useMutation, gql } from '@apollo/client'

export const LOGIN_MUTATION = gql`
mutation LoginMutation(
    $username: String!
    $password: String!
){
    tokenAuth(username: $username, password:$password) {
      token
      refreshExpiresIn
    }
  }
`

const Login = ({setToken}) => {
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
          setToken(tokenAuth.token)

          history.location.pathname === '/' 
            ? history.push(`/profiles/${formState.username}`)
            : history.push(history.location.pathname)
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