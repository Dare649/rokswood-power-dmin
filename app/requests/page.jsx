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
import Image from 'next/image';
import user from '@/public/images/user.png';

const Requests = () => {
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = useState(false);
    const [agents, setAgents] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('asc');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [approved, setApproved] = useState(false);
    const router = useRouter();

    // Fetch agent data from API
    useEffect(() => {
        const fetchAgentRequest = async () => {
            setLoading(true);
            try {
                const url = '/v1/manage/agents/requests';
                const response = await axiosClient.get(url, {
                    params: {
                        is_approved: approved,
                        detailed: 'true',
                        sort: sort,
                        page: page + 1,
                        size: pageSize,
                        'date-from': dateFrom ? dateFrom.toISOString().split('T')[0] : null,
                        'date-to': dateTo ? dateTo.toISOString().split('T')[0] : null,
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

        fetchAgentRequest();
    }, [page, pageSize, sort, dateFrom, dateTo, approved]);

    // Handle pagination click
    const handlePageClick = (event) => {
        setPage(event.selected);
    };

    

    

    return (
        <section className='w-full'>
            <div className="bg-white w-full rounded-lg">
                <h1 className='font-bold text-neutral3 capitalize py-5 lg:text-xl sm:text-lg'>agent request management</h1>
                <div className="relative overflow-x-auto w-full h-full lg:p-8 sm:p-4">

                    {/*  Date Filters */}
                    <div className="flex lg:flex-row sm:flex-col gap-4 mb-4">
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
                        <button
                            className=' font-bold text-primary1 px-2 py-0 capitalize'
                            onClick={() => setApproved(true)} // Fetch approved requests
                        >
                            view approved request
                        </button>
                    </div>

                    {/* Agent Data Table */}
                    <table className="w-full h-full">
                        <thead className="text-left text-gray-700 lg:text-md sm:text-sm uppercase">
                            <tr>
                                <th className='px-5 py-3'>date</th>
                                <th className='px-5 py-3'>image</th>
                                <th className='px-5 py-3'>name</th>
                                <th className='px-5 py-3'>serial number</th>
                                <th className='px-5 py-3'>email</th>
                                <th className='px-5 py-3'>status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center font-bold text-lg text-primary-100">
                                        No agents requests available
                                    </td>
                                </tr>
                            ) : (
                                agents.map((agent) => (
                                    <tr
                                        key={agent.id}
                                        onClick={() => router.push(`/requests/${agent.id}`)}
                                        className="border-t border-gray-200 capitalize cursor-pointer odd:bg-neutral1/50"
                                    >
                                        <td className='px-5 py-2'>{new Date(agent.created_at).toLocaleDateString()}</td>
                                        <td className='px-5 py-2'>
                                            <Image
                                                src={agent.user.image_url || user}
                                                alt='Rokswood Power'
                                                width={160}
                                                height={160}
                                                className='w-10 h-10 rounded-full'
                                            />
                                        </td>
                                        <td className='px-5 py-2'>{agent.user.name}</td>
                                        <td className='px-5 py-2'>{agent.user.serial_number}</td>
                                        <td className='px-5 py-2'>{agent.user.email}</td>
                                        <td className={`px-5 py-2 ${agent.user.status === 'active' ? 'text-green1' :  'text-orange1'}`}>{agent.user.status}</td>
                                        
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

export default Requests;
