import React from 'react'
import PropTypes from 'prop-types'

import Loading from '../Loading'
import DashboardCard from '../DashboardCard'

const BankDashboard = ({profileData}) => {
    if (!profileData) return <Loading />

    const {user, g3} = profileData

    return (
        <div className='dashboard'>
            <div className="container">
                <div className="d-flex justify-content-around mt-5">
                    {user.isStaff && g3 && <DashboardCard header={'Banks'} route={'/banks'}>View and Edit Bank Details</DashboardCard>}
                    {g3 && (
                        <>
                            <DashboardCard header={'Bank Accounts'} route={'/bank-accounts'}>View bank accounts.</DashboardCard>
                            <DashboardCard header={'Transfers'} route={'/transfers'}>Submit and view Bank transfers.</DashboardCard>
                        </>)
                    }
                </div>
            </div>
        </div>
    )
}

BankDashboard.propTypes = {
    profileData: PropTypes.object
}

export default BankDashboard