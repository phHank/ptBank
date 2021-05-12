import React from 'react'

const UrgentTransfer = ({setFormData, formData}) => (
    <>
        <label htmlFor='urgent'>Urgent Transfer: </label>
        <input 
        id='urgent'
        type='checkbox'
        onChange={() => setFormData({
            ...formData,
            urgent: !formData.urgent
        })}
        />
    </>
)

export default UrgentTransfer