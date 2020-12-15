// CREATE A NEW POST, used in Home.js

import React, { Fragment } from 'react'
import { Button, Form } from 'semantic-ui-react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/hooks'
import { FETCH_POSTS_QUERY } from '../util/graphql'

function PostForm(){

    const { values, onChange, onSubmit } = useForm(createPostCallback, {
        body: ''
    })


    // Query Apollo cache to get access to data from getPosts query
    // to display on front-end
    const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
            query: FETCH_POSTS_QUERY
            });
            proxy.writeQuery({
                query: FETCH_POSTS_QUERY,
                data: [result.data.getPosts, ...data.getPosts]
              });
              values.body = '';
            },
            refetchQueries: refetchPosts => [{ query: FETCH_POSTS_QUERY }]
          })

    function createPostCallback(){
        createPost()
    }

    return (
        <Fragment>
            <Form onSubmit={onSubmit}>
            <h2>Create a post:</h2>
                <Form.Field>
                    <Form.Input
                        placeholder="Hi World!"
                        name="body"
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false}
                    />
                    <Button type="submit" color="teal">
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className='ui error message' style={{ marginBottom: 20 }}>
                    <ul className='list'>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}        
        </Fragment>
    )
}

// Create Mutation to persist new post
const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id
            body
            createdAt
            username
            likes {
                id
                username
                createdAt
            }
            likeCount
            comments{
                id
                body
                username
                createdAt
            }
            commentCount
        }
    }
`

export default PostForm