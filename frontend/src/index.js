import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter as Router } from 'react-router-dom'

import {
    ApolloProvider,
    ApolloClient,
    InMemoryCache
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

import { createUploadLink } from 'apollo-upload-client'

import App, { AUTH_TOKEN } from './components/App'

const link = createUploadLink({
    uri: 'http://localhost:8000/graphql/',
  })

const authLink = setContext((_, {headers}) => {
    const token = AUTH_TOKEN
    return {
        headers: {
            ...headers,
            authorization: token ? `JWT ${token}` : ''
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
})

ReactDOM.render(
    <Router>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </Router>,
    document.getElementById('root')
)