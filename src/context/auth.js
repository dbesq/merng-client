// Manage global logged in state

import React, { useReducer, createContext }  from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
    user: null
}

// Check for jwt
if(localStorage.getItem('jwtToken')){
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

    if(decodedToken.exp * 1000 < Date.now()){
        localStorage.removeItem('jwtToken')
    } else {
        initialState.user = decodedToken
    }
}

// Use for components to access Context
const AuthContext = createContext({
    user: null,
    login: (userData) => {},
    logout: () => {}
})

// Reducer - receives action w/ type and payload and does something with them
// Used in authProvider below
function authReducer(state, action){
    switch(action.type){
        case 'LOGIN':
            return{
                ...state,
                user: action.payload
            }
        case 'LOGOUT':
            return{
                ...state,
                user: null
            }
        default:
            return state
    }
}

// Wraps application so components have access
function AuthProvider(props){
    const [state, dispatch] = useReducer(authReducer, initialState)

    // When dispatched, authReducer will take this and do something w/ it
    function login(userData){
        // Persist token in local storage
        localStorage.setItem('jwtToken', userData.token)
        dispatch({
            type: 'LOGIN',
            payload: userData
        })
    }

    // No need for payload for logging out
    function logout(){
        // Remove token from local storage
        localStorage.removeItem('jwtToken')
        dispatch({
            type: 'LOGOUT'
        })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, login, logout }}
            { ...props }
        />
    )
}

export { AuthContext, AuthProvider}