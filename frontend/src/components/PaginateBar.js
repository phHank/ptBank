import React from 'react'

import { resultsPerPage } from '../utils/constants'

const PaginateBar = ({page, count, setPageNo, refetch}) => {
    const stopPage = count / resultsPerPage

    const handlePageChange = newPageNo => {
		setPageNo(newPageNo)
		
		refetch({
			skip: (newPageNo - 1) * resultsPerPage,
			first: resultsPerPage
		})
	}
    
    return (
        <div className='container d-flex flex-row' style={{height: '1.5rem'}}>
            {page > 2 && <button className='btn btn-dark py-0' onClick={() => handlePageChange(1)}><small>&#8676;</small></button>}
            {page > 1 && <button className='btn btn-dark py-0'onClick={() => handlePageChange(page - 1)}><small>&#8592;</small></button>}

            {/* {page > 1 && <button className='btn btn-dark py-0'onClick={() => handlePageChange(page - 1)}><small>{page - 1}</small></button>} */}
            <button className='btn btn-light py-0 border' disabled>
                <small style={{fontWeight: 'bold'}}>
                    {page}
                </small>
            </button>
            {/* {page < stop && <button className='btn btn-dark py-0' onClick={() => handlePageChange(page + 1)}><small>{page + 1 }</small></button>} */}

            {page < stopPage && <button className='btn btn-dark py-0' onClick={() => handlePageChange(page + 1)}><small>&#8594;</small></button>}
            {stopPage - page > 1 && <button className='btn btn-dark py-0' onClick={() => handlePageChange(Math.ceil(stopPage))}><small>&#8677;</small></button>}
        </div>
    )
}

export default PaginateBar