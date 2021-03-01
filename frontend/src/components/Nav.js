import React from 'react'

import { NavLink } from 'react-router-dom'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import NavSearch from './NavSearch'

import { linkStyle } from '../utils/constants'

const Navigation = ({profileData}) => (
    <Navbar 
        className='d-flex justify-content-between px-2' 
        style={{opacity: 0.5}} 
        bg='dark' 
        variant="dark" 
    >
        <NavLink to='/' style={linkStyle}>Hi {profileData?.user?.firstName}</NavLink>
        <div className='d-flex justify-content-center align-items-center'>
            <h1>
                <Navbar.Brand href='https://www.pearse-trust.ie/' target='_blank'>
                    Your Brand Here
                </Navbar.Brand>
            </h1>
            <Nav>
                <NavLink to='/' style={linkStyle}>| Home</NavLink>
                {profileData?.user?.isStaff && <NavLink to='/clients' style={linkStyle}>| Clients</NavLink>}
                <NavLink to='/companies' style={linkStyle}>| Companies</NavLink>
                {profileData?.g1 && <NavLink to='/legal' style={linkStyle}>| Legal</NavLink>}
                {profileData?.g2 && <NavLink to='/cosec' style={linkStyle}>| Co-Sec</NavLink>}
                {profileData?.g3 && <NavLink to='/banking' style={linkStyle}>| Banking</NavLink>}
            </Nav>
        </div>
        <NavSearch />
    </Navbar>
)

export default Navigation