import React from 'react'

const SortCodeInput = ({setFormData, formData}) => (
    <div>
        <label className='col-xl-12'>Sort Code (NSC)</label>
        <input className='bg-light text-dark' type='number' step='1' min='1' max='99' placeholder='99' 
          onChange={e => {
            const sortCodeArray = formData.sortCode
            sortCodeArray[0] = e.target.value
            setFormData({
            ...formData,
            sortCode: sortCodeArray
            })
          }}
          value={formData.sortCode[0]}
        />
        <input className='bg-light text-dark' type='number' step='1' min='1' max='99' placeholder='99' 
          onChange={e => {
            const sortCodeArray = formData.sortCode
            sortCodeArray[1] = e.target.value
            setFormData({
            ...formData,
            sortCode: sortCodeArray
            })
          }}
          value={formData.sortCode[1]}
        />
        <input className='bg-light text-dark' type='number' step='1' min='1' max='99' placeholder='99' 
          onChange={e => {
            const sortCodeArray = formData.sortCode
            sortCodeArray[2] = e.target.value
            setFormData({
            ...formData,
            sortCode: sortCodeArray
            })
          }}
          value={formData.sortCode[2]}
        />
    </div>
)

export default SortCodeInput