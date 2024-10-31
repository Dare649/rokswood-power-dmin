'use client'

import { useState, useEffect} from 'react';
import { axiosClient } from '@/axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Orders = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [orderType, setOrderType] = useState('GAS');
    const [page, setPage] = useState(0);
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('asc');
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);
    const [order, setOrder] = useState([]);
    const orderTypes = ['GAS', 'POWER', 'WATER'];

    useEffect(() => {
        fetchOrder();
    
    }, [id, orderType, page, dateFrom, dateTo]);
    
    const fetchOrder = async () => {
        setLoading(true);
        try {
            const url = `/v1/manage/agents/${id}/orders`;
            const response = await axiosClient.get(url, {
                params: {
                    detailed: 'true',
                    sort,
                    page: page + 1, // Pagination is 1-based
                    size: pageSize,
                    'date-from': dateFrom ? dateFrom.toISOString().split('T')[0] : null,
                    'date-to': dateTo ? dateTo.toISOString().split('T')[0] : null,
                    service_type: orderType,
                },
            });
            setOrder(response.data.data.items);
            setTotalPages(response.data.data.total_pages);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Failed to fetch data',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };
    
    const handlePageClick = ({ selected }) => {
        setPage(selected);
    };

    const handleServiceTypeChange = (type) => {
        setOrderType(type);
        setPage(0); // Reset pagination to the first page
    };
    return (
        <div className='w-full'>
            <div className="relative overflow-x-auto w-full h-full lg:p-8 sm:p-4 py-5 ">
                <div className="flex gap-4 mb-4">
                    {orderTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => handleServiceTypeChange(type)}
                            className={`px-4 py-2 rounded-md ${orderType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

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
                </div>

                <table className="w-full h-full">
                    <thead className="text-left text-gray-700 lg:text-md sm:text-sm uppercase">
                        <tr>
                            <th className="px-5 py-3">date</th>
                            <th className="px-5 py-3">name</th>
                            <th className="px-5 py-3">description</th>
                            <th className="px-5 py-3">payment method</th>
                            <th className="px-5 py-3">status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center font-bold text-lg text-primary-100">
                                    No orders available
                                </td>
                            </tr>
                        ) : (
                            order.map((item) => (
                                <tr key={item.id} className="border-t border-gray-200 capitalize cursor-pointer odd:bg-neutral1/50">
                                    <td className="px-5 py-2">{new Date(item.created_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-2">{item.customer_name}</td>
                                    <td className="px-5 py-2">{item.description}</td>
                                    <td className="px-5 py-2">{item.method}</td>
                                    <td className={`px-5 py-2 ${item.status === 'completed' ? 'text-green1' : 'text-orange1'}`}>
                                        {item.status}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="w-full flex float-right my-10">
                    <ReactPaginate
                        previousLabel={"Prev"}
                        nextLabel={"Next"}
                        breakLabel={"..."}
                        pageCount={totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handlePageClick}
                        forcePage={page}
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
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default Orders;