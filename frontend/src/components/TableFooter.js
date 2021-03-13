import React from 'react'

const TableFooter = ({ resCount }) => (
    <tfoot >
        <tr>
            <td>Matches Found: {resCount}</td>
        </tr>
    </tfoot>
)

export default TableFooter