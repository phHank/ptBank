import React from 'react'

import { snakeCase } from '../utils/helpers'

const TableHead = ({refetch, headings}) => (
    <thead>
        <tr>
            {headings.map(heading => (
                    <th 
                    key={heading} 
                    onClick={() => refetch({orderBy: snakeCase(heading)})}
                    style={{cursor: 'pointer'}}
                    >
                        {heading}
                    </th>
                )
            )}
        </tr>
    </thead>
)

export default TableHead