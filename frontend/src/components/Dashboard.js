import React from 'react'
import PropTypes from 'prop-types'

import Spinner from 'react-bootstrap/Spinner'

import DashboardCard from './DashboardCard'

const Dashboard = ({profileData}) => {
    if (!profileData) return (
        <div className='d-flex w-100 h-100 justify-content-center'>
            <Spinner animation="border" role="status" variant="primary" />
        </div>
    )

    const {user, g1, g2, g3, clientProfile} = profileData

    return (
        <div className='dashboard'>
            <div className="container">
                <div className="d-flex justify-content-around mt-5">
                    {clientProfile && (
                        <DashboardCard header={'Your Company Details'} route={`/dashboard/${clientProfile.id}`}>
                            View your company information and request updates.
                        </DashboardCard>)
                    }
                    {user.isStaff && <DashboardCard header={'Clients'} route={'/clients'}>Find client information.</DashboardCard>}
                    <DashboardCard header={'Companies'} route={'/companies'}>View company information.</DashboardCard>
                    {g1 && <DashboardCard header={'Legal'} route={'/legal'}>Do what legal does.</DashboardCard>}
                    {g2 && <DashboardCard header={'Company Secretarial'} route={'/cosec'}>File records and update company info.</DashboardCard>}
                    {g3 && <DashboardCard header={'Banking'} route={'/banking'}>Bank transfers, statements, and account openings &amp; closures.</DashboardCard>}
                </div>
            </div>
        </div>
    )
}

DashboardCard.propTypes = {
    profileData: PropTypes.object
}

export default Dashboard