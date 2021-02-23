import React, { useState } from 'react'

import { useHistory } from 'react-router'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'


const Navigation = ({firstName}) => {
    const [query, setQuery] = useState('')
    const history = useHistory()

    return (
        <Navbar className='d-flex justify-content-between' style={{opacity: 0.5}} bg='dark' variant="dark" >
            <div className='text-light'>Hi {firstName}</div>
            <div className='d-flex justify-content-center align-items-center'>
                <h1>
                    <Navbar.Brand href="https://www.pearse-trust.ie/">Pearse Trust Online</Navbar.Brand>
                </h1>
                <Nav className="mr-auto">
                    <Nav.Link href="#">Home</Nav.Link>
                    <Nav.Link href="#">| Features</Nav.Link>
                    <Nav.Link href="#">| Pricing</Nav.Link>
                </Nav>
            </div>
            {!history.location.pathname.includes('/dashboard') && (
                <Form onSubmit={e => {
                    e.preventDefault()
                    history.push(`/search`)
                    }}>
                    <input 
                      className='bg-light text-dark' 
                      placeholder='Search' 
                      type='text' 
                      value={query}
                      onChange={e => {setQuery(e.target.value)}}
                      />
                    <Button variant='light' type='submit'>Search</Button>
                </Form>
            )}
        </Navbar>
    )

}  

export default Navigation