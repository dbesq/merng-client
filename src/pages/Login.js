
import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'

import { useForm } from '../util/hooks'

function Login(props){
    // First, set up context to get access to logged in state from context/auth.js,
    // which holds user and login and logout functions
    const context = useContext(AuthContext)

    const [errors, setErrors] = useState({})

    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username: '',
        password: ''
    })
    
    // Add the user and update database, then redirect to homepage
    const [ loginUser, { loading } ] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }){
            // data: { login: userData } destructures the result argument from useMutation
            // to get the userData to pass to context
            console.log(userData)
            context.login(userData)
            props.history.push('/')
        },
        variables: values,
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors)
			
		}
    })

    // Use the following so that loginUser has access to prev info
    // b/c of hoisting issues b/w const and function
    function loginUserCallback(){
        loginUser()
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={ loading ? "loading" : '' }>
                <h1>Login</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username"
                    name="username"
                    type="text"
                    value={values.username}
                    errors={errors.username ? true : false }
                    onChange={onChange}
                />
                
                <Form.Input
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={values.password}
                    errors={errors.password ? true : false }
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Login
                </Button>
            
            </Form>

            {Object.keys(errors).length > 0 && 
                <div className='ui error message'>
                <ul className='list'>
                    {Object.values(errors).map(value => {
                        return <li key={value}>{value}</li>
                    })}
                </ul>
            </div>
            }

        </div>
    )
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
            username: $username
            password: $password
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Login