import React from 'react'

const Dashboard = ({userProfile}) => (
    <div className='dashboard'>
        <p>Hi {JSON.stringify(userProfile)}!</p>
    </div>
)

export default Dashboard