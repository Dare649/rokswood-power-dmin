"use client";
import { useState, useEffect } from 'react';
import { axiosClient } from '@/axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Backdrop, CircularProgress } from '@mui/material';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';

const Agents = () => {
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('asc');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

// Fetch agent data from API
useEffect(() => {
    const fetchAgents = async () => {
        setLoading(true);
        try {
            // Determine URL based on searchTerm
            const url = searchTerm ? '/v1/manage/agents/search' : '/v1/manage/agents';

            // Set params based on if it's a search or standard list fetch
            const response = await axiosClient.get(url, {
                params: {
                    detailed: 'true',
                    sort: sort,
                    page: page + 1,
                    size: pageSize,
                    'date-from': dateFrom ? dateFrom.toISOString().split('T')[0] : null,
                    'date-to': dateTo ? dateTo.toISOString().split('T')[0] : null,
                    q: searchTerm || undefined,
                },
            });

            setAgents(response.data.data.items);
            setTotalPages(response.data.data.total_pages);
        } catch (error) {
            MySwal.fire({
                icon: 'error',
                title: 'Failed to fetch data',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    fetchAgents();
}, [page, pageSize, sort, dateFrom, dateTo, searchTerm]);

// Handle pagination click
const handlePageClick = (event) => {
    setPage(event.selected);
};

// Handle search submit
const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to the first page on new search
};

    return (
        <section className='w-full'>
            <div className="bg-white w-full rounded-lg">
                <h1 className='font-bold text-neutral3 capitalize py-5 lg:text-xl sm:text-lg'>agent management</h1>
                <div className="relative overflow-x-auto w-full h-full lg:p-8 sm:p-4">

                    {/* Search and Date Filters */}
                    <div className="flex lg:flex-row sm:flex-col gap-4 mb-4">
                        <form onSubmit={handleSearch} className="flex flex-col items-center">
                            <h2 className="block text-neutral3 capitalize text-left">search</h2>
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border px-3 py-2 rounded-md w-64 active:border-primary1"
                            />
                            
                        </form>
                        <div>
                            <label className="block text-neutral3 capitalize">start date</label>
                            <DatePicker
                                selected={dateFrom}
                                onChange={(date) => setDateFrom(date)}
                                dateFormat="yyyy-MM-dd"
                                className="border px-2 py-1 rounded"
                                placeholderText="Select start date"
                            />
                        </div>
                        <div>
                            <label className="block text-neutral3 capitalize">end date</label>
                            <DatePicker
                                selected={dateTo}
                                onChange={(date) => setDateTo(date)}
                                dateFormat="yyyy-MM-dd"
                                className="border px-2 py-1 rounded"
                                placeholderText="Select end date"
                            />
                        </div>
                    </div>

                    {/* Agent Data Table */}
                    <table className="w-full h-full">
                        <thead className="text-left text-gray-700 lg:text-md sm:text-sm uppercase">
                            <tr>
                                <th className='px-5 py-3'>date</th>
                                <th className='px-5 py-3'>name</th>
                                <th className='px-5 py-3'>email</th>
                                <th className='px-5 py-3'>phone</th>
                                <th className='px-5 py-3'>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center font-bold text-lg text-primary-100">
                                        No agents available
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr
                                        key={agent.id}
                                        onClick={() => router.push(`/agents/${agent.id}`)}
                                        className="border-t border-gray-200 capitalize cursor-pointer odd:bg-neutral1/50"
                                    >
                                        <td className='px-5 py-2'>{new Date(agent.created_at).toLocaleDateString()}</td>
                                        <td className='px-5 py-2'>{agent.name}</td>
                                        <td className='px-5 py-2'>{agent.email}</td>
                                        <td className='px-5 py-2'>{agent.phone}</td>
                                        <td className={`px-5 py-2 ${agent.status === 'completed' ? 'text-green1' :  'text-orange1'}`}>{agent.status}</td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="w-full flex float-right my-10">
                        <ReactPaginate
                            previousLabel={"Prev"}
                            nextLabel={"Next"}
                            breakLabel={"..."}
                            pageCount={totalPages}
                            marginPagesDisplayed={2}
                            pageRangeDisplayed={3}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            pageClassName={"page-item"}
                            pageLinkClassName={"page-link"}
                            previousClassName={"page-item"}
                            previousLinkClassName={"page-link"}
                            nextClassName={"page-item"}
                            nextLinkClassName={"page-link"}
                            breakClassName={"page-item"}
                            breakLinkClassName={"page-link"}
                            activeClassName={"active"}
                        />
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </section>
    );
};

export default Agents;
