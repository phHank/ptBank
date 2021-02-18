import React from 'react'
import ReactDOM from 'react-dom'

import {
    ApolloProvider,
    ApolloClient,
    createHttpLink,
    InMemoryCache
} from '@apollo/client'

import App from './components/App'

const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql/'
})

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root')
)