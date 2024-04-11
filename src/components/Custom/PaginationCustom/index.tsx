import React, { SetStateAction } from 'react';
import Pagination from '../../../base-components/Pagination';
import Lucide from '../../../base-components/Lucide';
import {FormSelect} from '../../../base-components/Form';

type PaginationCustomProps = {
  setPage: React.Dispatch<SetStateAction<number>>
  page: number
  perPage: number
  setPerPage: React.Dispatch<SetStateAction<number>>
  totalPages: number
  totalCount: number
}

const PaginationCustom = ({
    setPage,
    page,
    perPage,
    setPerPage,
    totalPages,
    totalCount
}: PaginationCustomProps ) => {
  return (
         <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
          <Pagination className="w-full sm:w-auto sm:mr-auto">
            <div onClick={() => setPage(1)}>
              <Pagination.Link>
                <Lucide icon="ChevronsLeft" className="w-4 h-4" />
              </Pagination.Link>
            </div>
            <div onClick={() => setPage((prev) => prev === 1 ? 1 : prev - 1)}>
              <Pagination.Link>
                <Lucide icon="ChevronLeft" className="w-4 h-4" />
              </Pagination.Link>
            </div>
            {
              [...Array(totalPages)].map((e, i) => 
              <div onClick={() => setPage(i + 1)} className={`${i + 1 - page > 1 || i + 1 - page < -1 ? 'hidden': ''}`}>
                <Pagination.Link key={i} active={page === i + 1} className='px-2 h-9'>
                  {i + 1}
                </Pagination.Link>
              </div>)
            }
            <div onClick={() => setPage((prev) => prev === totalPages ? totalPages : prev + 1)}>
              <Pagination.Link>
                <Lucide icon="ChevronRight" className="w-4 h-4" />
              </Pagination.Link>
            </div>
            <div onClick={() => setPage(totalPages)}>
              <Pagination.Link>
                <Lucide icon="ChevronsRight" className="w-4 h-4" />
              </Pagination.Link>
            </div>
          </Pagination>
          <div className="hidden mr-8 lg:block text-slate-500">
            Showing {(page * perPage) - (perPage - 1)} to {page * perPage < totalCount ? page * perPage : totalCount} of {totalCount} entries
          </div>
          <FormSelect onChange={(e) => setPerPage(e.target.value as unknown as number)} className="w-20 mt-3 !box sm:mt-0">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={35}>35</option>
            <option value={50}>50</option>
          </FormSelect>
        </div>
  )
}

export default PaginationCustom