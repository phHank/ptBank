import React from 'react'

const TextInput = ({name, type, placeholder, value, handleChange}) => (
    <div className='form-group col-md-6'>
        <label htmlFor={name}>
            {name.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()}
        </label>
        <input 
          type={type ? type : 'text'} 
          className='form-control' 
          id={name} 
          placeholder={placeholder} 
          value={value}
          onChange={e => handleChange(e, name)}
          />
    </div>
) 

export default TextInput