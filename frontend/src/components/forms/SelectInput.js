import React from 'react'

const SelectInput = ({name, options, handleChange}) => (
    <div className='form-group col-md-4'>
        <label htmlFor={name}>
            {name.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}
        </label>
        <select
          onChange={e => handleChange(e, name)}
          id={name} 
          className='form-control'
          defaultValue='disabled'
        >
            <option value='disabled' disabled>-</option>
            {options.map(option => 
                (<option key={option} value={option}>{option}</option>)
            )}
        </select>
    </div>
)

export default SelectInput