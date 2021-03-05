import React from 'react'

const SelectInput = ({name, options, handleChange, defaultVal, req}) => (
    <div className='form-group col-md-4'>
        <label className='text-capitalize' htmlFor={name}>
            {name.replace(/([a-z])([A-Z])/g, '$1 $2')}
        </label>
        <select
          onChange={e => handleChange(e, name)}
          id={name} 
          className='form-control'
          defaultValue={defaultVal ? defaultVal : 'disabled'}
          required={req}
        >
            <option value='disabled' disabled>-</option>
            {options.map(option => 
                (<option key={option} value={option}>{option}</option>)
            )}
        </select>
    </div>
)

export default SelectInput