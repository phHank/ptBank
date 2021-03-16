import React from 'react'

const ClientDropDown = ({name, options, handleChange, defaultVal, req, disabled}) => (
    <div className='form-group col-md-4'>
        <label className='text-capitalize' htmlFor={name}>
            {name.replace(/([a-z])([A-Z])/g, '$1 $2')}
        </label>
        <select
          onChange={e => handleChange(e, name)}
          id={name} 
          className='form-control'
          defaultValue='disabled'
          required={req}
          disabled={disabled}
        >
            <option value='disabled' disabled>-</option>
            {options.map(option => 
                (<option 
                    key={option.clientId} 
                    className={defaultVal === option.clientId ? 'bg-dark text-light' : undefined} 
                    value={option.clientId}
                 >
                    {option.client}
                </option>)
            )}
        </select>
    </div>
)

export default ClientDropDown