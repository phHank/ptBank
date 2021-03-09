import React from 'react'

const FileInput = ({setFile, req}) => (
    <input 
      className='form-control-file m-1'
      type='file' 
      onChange={({target}) => {
        setFile(target.files[0])
      }}
      required={req}
    />
)

export default FileInput