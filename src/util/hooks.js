// Custom hooks for Register.js and Login.js

import { useState } from 'react'

// Callback defined in separate files where this hook may be used
export const useForm = (callback, initialState = {}) => {
 
    // Set the state
    // initialState defined and set in Register and Login
    const [values, setValues] = useState(initialState)

    // When user inputs into the form, the state is updated to reflect user input
    const onChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value })
    }

    const onSubmit = (event) => {
        event.preventDefault()
        callback()
    }

    return {
        onChange,
        onSubmit,
        values
    }
}