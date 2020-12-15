// Apollo Provider wrapper
import React from 'react'
import App from './App'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'

const httpLink = createHttpLink({
    uri: 'https://fathomless-dusk-10581.herokuapp.com/'
})

// Get token from localStorage to use when creating new posts in components/PostForm.js
// Puts the token in context for use in other components
const authLink = setContext(() => {
    const token = localStorage.getItem('jwtToken')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})

const client  = new ApolloClient({
    // Add token to request
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})


export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)