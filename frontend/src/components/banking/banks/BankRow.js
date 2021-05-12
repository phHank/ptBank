import React, { useState } from 'react'

import EditBankForm from './EditBankForm'

const BankRow = ({bankData}) => {
    const [edit, setEdit] = useState(false)
    
    return (
        edit 
            ? (<EditBankForm setEdit={setEdit} bankData={bankData} />)
            : (
                <tr>
                    <td>{bankData.name}</td>
                    <td>{bankData.country}</td>
                    <td className='d-flex justify-content-around'>
                        <button 
                        className='btn btn-primary btn-sm' 
                        onClick={() => setEdit(true)}
                        >
                            Edit
                        </button>  
                    </td>
                </tr>
              )
    )
}

export default BankRow