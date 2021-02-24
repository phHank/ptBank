import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Card from 'react-bootstrap/Card'

import { linkStyle } from '../utils/constants'

const DashboardCard = ({header, route, children}) => {
    return (
        <Link style={linkStyle} to={`${route}`}>
            <Card
              bg='dark'
              text='light'
              style={{ width: '18rem', height: '10rem', opacity: 0.75}}
            >
            <Card.Header className='text-center'>{header}</Card.Header>
            <Card.Body>
            <Card.Text className='text-light'>{children}</Card.Text>
            </Card.Body>
        </Card>
      </Link>
    )
}

DashboardCard.propTypes = {
    header: PropTypes.string.isRequired,
    route: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired
}

export default DashboardCard