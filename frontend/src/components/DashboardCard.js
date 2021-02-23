import React from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'

import Card from 'react-bootstrap/Card'

const DashboardCard = ({header, route, children}) => {
    return (
        <Link style={{color: '#FFF', textDecoration: 'none'}} to={`${route}`}>
            <Card
              bg='dark'
              text='light'
              style={{ width: '18rem', height: '10rem', opacity: 0.75}}
            >
            <h5><Card.Header className='text-center'>{header}</Card.Header></h5>
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