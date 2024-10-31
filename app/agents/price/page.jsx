'use client'

import { useState, useEffect} from 'react';
import { axiosClient } from '@/axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';



const Prices = ({ id }) => {
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([]);

    useEffect(() => {
        fetchPrice();
    
    }, [id]);
    
    const fetchPrice = async () => {
        setLoading(true);
        try {
            const url = `/v1/manage/agents/${id}/price`;
            const response = await axiosClient.get(url);
            setPrice(response.data.data.items);
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
    

    return (
        <div className='w-full'>
            <div className="relative overflow-x-auto w-full h-full lg:p-8 sm:p-4 py-5 ">
            
                <table className="w-full h-full">
                    <thead className="text-left text-gray-700 lg:text-md sm:text-sm uppercase">
                        <tr>
                            <th className="px-5 py-3">date updated</th>
                            <th className="px-5 py-3">currency</th>
                            <th className="px-5 py-3">service</th>
                            <th className="px-5 py-3">unit</th>
                            <th className="px-5 py-3">cost price/unit</th>
                            <th className="px-5 py-3">profit/unit</th>
                            <th className="px-5 py-3">price locale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {price.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center font-bold text-lg text-primary-100">
                                    No price available
                                </td>
                            </tr>
                        ) : (
                            price.map((item) => (
                                <tr key={item.id} className="border-t border-gray-200 capitalize cursor-pointer odd:bg-neutral1/50">
                                    <td className="px-5 py-2">{new Date(item.updated_at).toLocaleDateString()}</td>
                                    <td className="px-5 py-2">{item.currency}</td>
                                    <td className="px-5 py-2">{item.service}</td>
                                    <td className="px-5 py-2">{item.unit_measurement_short}</td>
                                    <td className="px-5 py-2">{item.cost_price_per_unit}</td>
                                    <td className="px-5 py-2">{item.price_locale}</td>
                                    
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

export default Prices;