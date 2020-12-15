
import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/hooks'

function Register(props){
    // First, set up context to get access to logged in state from context/auth.js,
    // which holds user and login and logout functions
    const context = useContext(AuthContext)

    const [errors, setErrors] = useState({})
    
    const { onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''        
    })

    // Add the user and update database, then redirect to homepage
    const [ addUser, { loading } ] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData }}){
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

    // Use the following so that addUser has access to prev info
    // b/c of hoisting issues b/w const and function
    function registerUser(){
        addUser()
    }

    return (
        <div className='form-container'>
            <Form onSubmit={onSubmit} noValidate className={ loading ? "loading" : '' }>
                <h1>Register</h1>
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
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    errors={errors.email ? true : false }
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

                <Form.Input
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={values.confirmPassword}
                    errors={errors.confirmPassword ? true : false }
                    onChange={onChange}
                />

                <Button type="submit" primary>
                    Register
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

const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Register