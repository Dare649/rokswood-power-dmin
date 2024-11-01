"use client";
import { useEffect, useState } from 'react';
import { axiosClient } from '@/axios';
import { useRouter, useParams } from 'next/navigation'; 
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import Image from 'next/image';
import GraphSlider from '@/components/GraphSlidder';
import 'react-datepicker/dist/react-datepicker.css';
import Tabs from '../../../components/Tabs';
import Orders from '../orders/page';
import Meters from '../meters/page';
import Installations from '../installations/page';
import Prices from '../price/page';

const AgentDetail = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params || {};
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stat, setStat] = useState(null);
    const [graphDetails, setGraphDetails] = useState([]);
    const [serviceType, setServiceType] = useState('GAS');
    const serviceTypes = ['GAS', 'POWER', 'WATER'];
    const initialState = 'revoke';
    const [status, setStatus] = useState(initialState);


   

    useEffect(() => {
        if (!id) return;
    
        const fetchAgent = async () => {
            try {
                const response = await axiosClient.get(`/v1/manage/agents/${id}`);
                setAgent(response.data.data);
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
    
        const fetchStat = async () => {
            try {
                const response = await axiosClient.get(`/v1/manage/agents/${id}/stats/summary`);
                setStat(response.data.data);
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
    
        fetchAgent();
        fetchStat();

    
    }, [id]);
    
    

    useEffect(() => {
        const fetchGraphData = async () => {
            try {
                const response = await axiosClient.get(`/v1/manage/agents/${id}/graph/orders`, {
                    params: {
                        service_type: serviceType,
                        is_fulfilled: true,
                        range: 7,
                        view: 'day',
                        diff: true,
                    },
                });

                const formattedData = {
                    labels: response.data.data.map((item) => item.key),
                    result: response.data.data.map((item) => item.units_sold),
                    title: `Units Sold (${response.data.data[0]?.unit_measurement || ''})`,
                    backgroundColor: 'bg-blue-500', // Replace with appropriate color if needed
                };

                setGraphDetails([formattedData]);
            } catch (error) {
                console.error("Error fetching graph data:", error);
            }
        };

        fetchGraphData();
    }, [id, serviceType]);


    const toggleAgentProfile = async () => {
        const action = status === 'revoke' ? 'enable' : 'revoke';
        const endpoint = `/v1/manage/agents/${id}/${action}`;
    
        // Prompt user to enter a reason
        const { value: message } = await Swal.fire({
          title: `Enter reason for ${action === 'enable' ? 'enabling' : 'revoking'} profile`,
          input: 'text',
          inputPlaceholder: 'Enter reason here',
          showCancelButton: true,
        });
    
        // Exit if the user cancels the input
        if (!message) return;
    
        setLoading(true);
    
        try {
          const response = await axiosClient.put(endpoint, { message });
          if (response.data.status === true) {
            setStatus(action);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: response.data.message,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Something went wrong!',
          });
        } finally {
          setLoading(false);
        }
    };

    
    


    if (loading) {
        return (
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (!agent) return <p>Agent not found or loading failed.</p>;

    // Destructure meters_distribution safely for agent details
    const { meters_distribution } = agent.agent;

    // // Destructure meters_distribution safely for agent stat
    // const { meters_distribution } = stat.stat;

    return (
        <section className='w-full'>
           <div className='flex flex-row items-center justify-between my-10'>
                <button onClick={() => router.back()} className='text-primary1 capitalize font-bold'>back to agent </button>
                <button
                onClick={toggleAgentProfile}
                disabled={loading}
                className={`p-2 rounded font-bold text-white ${
                    status === 'revoke' ? 'bg-green-500' : 'bg-red-500'
                }`}
                >
                {loading
                    ? 'Processing...'
                    : status === 'revoke'
                    ? 'Enable Profile'
                    : 'Revoke Profile'}
                </button> 
           </div>
            <div className='w-full flex flex-col'>
                <div className='w-full py-5 border-b-2 border-neutral1'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>stats details</h1>
                    <div className='w-full grid lg:grid-cols-3 sm:grid-cols-1 md:grid-cols-2 gap-5 py-3'>
                    <div className='w-30 lg:p-5 sm:p-2 bg-primary1'>
                        <h2 className='text-white font-bold text-md capitalize'>installations</h2>
                        <h2 className='text-white font-bold text-xl'>{stat?.installations_count ?? 0}</h2>
                    </div>
                    <div className='w-30 lg:p-5 sm:p-2 bg-orange1'>
                        <h2 className='text-white font-bold text-md capitalize'>meters</h2>
                        <h2 className='text-white font-bold text-xl'>{stat?.meters_count ?? 0}</h2>
                    </div>
                    <div className='w-30 lg:p-5 sm:p-2 bg-green1'>
                        <h2 className='text-white font-bold text-md capitalize'>meters distribution</h2>
                        <div className='w-full grid grid-cols-3 gap-x-3 mt-3'>
                            <div>
                                <h2 className='text-white font-bold text-sm capitalize'>gas</h2>
                                <h2 className='text-white font-bold text-sm'>{stat?.meters_distribution?.GAS ?? 0}</h2>
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-sm capitalize'>power</h2>
                                <h2 className='text-white font-bold text-sm'>{stat?.meters_distribution?.POWER ?? 0}</h2>
                            </div>
                            <div>
                                <h2 className='text-white font-bold text-sm capitalize'>water</h2>
                                <h2 className='text-white font-bold text-sm'>{stat?.meters_distribution?.WATER ?? 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>

                </div>
                <div className='w-full py-5 border-b-2 border-neutral1'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>Personal Details</h1>
                    <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 items-center py-5 gap-5'>
                        <div className='my-2'>
                            {agent.user.image_url ? (
                                <Image
                                    src={agent.user.image_url}
                                    alt='Rokswood Power'
                                    width={160}
                                    height={160}
                                    className='w-40 h-40 rounded-full'
                                />
                            ) : (
                                <div className='w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center'>
                                    <p>No Image</p>
                                </div>
                            )}
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Name</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.user.name}</h2>
                        </div>
                        
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Serial Number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.user.serial_number}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Status</h4>
                            <h2 className={`font-bold text-neutral2 capitalize ${agent.user.status === 'active' ? 'text-green1' : 'text-orange1'}`}>{agent.user.status}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Email</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.user.email}</h2>
                        </div>
                    </div>
                </div>
                <div className='w-full py-5 border-b-2 border-neutral1 gap-5'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>Agent Details</h1>
                    <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 items-center my-5 px-5'>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Name</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.name}</h2>
                        </div>
                        
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Phone Number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.phone}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Address</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.address}</h2>
                        </div>
                        {/* <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Created Date</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{new Date(agent.agent.created_at).toLocaleDateString()}</h2>
                        </div> */}
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Installations</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.installations_count}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Meters</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.meters_count}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Status</h4>
                            <h2 className={`font-bold text-neutral2 capitalize ${agent.agent.status === 'completed' ? 'text-green1' : 'text-orange1'}`}>{agent.agent.status}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Email</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.agent.email}</h2>
                        </div>
                    </div>
                    {/* Meters Distribution */}
                    <div className='px-5 my-3'>
                        <h4 className='text-neutral3 text-lg font-bold capitalize '>Meters Distribution</h4>
                        <div className='w-full grid lg:grid-cols-3 sm:grid-cols-2 items-center'>
                            <div className='my-2'>
                                <h4 className='text-primary1 capitalize font-medium'>Gas</h4>
                                <h2 className='font-bold text-neutral2 capitalize'>{meters_distribution?.GAS || 0}</h2>
                            </div>
                            <div className='my-2'>
                                <h4 className='text-primary1 capitalize font-medium'>Power</h4>
                                <h2 className='font-bold text-neutral2 capitalize'>{meters_distribution?.POWER || 0}</h2>
                            </div>
                            <div className='my-2'>
                                <h4 className='text-primary1 capitalize font-medium'>Water</h4>
                                <h2 className='font-bold text-neutral2 capitalize'>{meters_distribution?.WATER || 0}</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full py-5 border-b-2 border-neutral1 gap-5'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>compliance details</h1>
                    <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 items-center my-5 px-5'>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>bank verification number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.bank_verification_number}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>business description</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.business_description}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>business registration number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.business_registration_number}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>id type</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.id_type}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>Created Date</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{new Date(agent.compliance.created_at).toLocaleDateString()}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>updated Date</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{new Date(agent.compliance.updated_at).toLocaleDateString()}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>national identification number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.national_identification_number}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>tax identification number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.compliance.tax_identification_number}</h2>
                        </div>
                        <Image
                            src={agent.compliance.address_verification}
                            alt='Rokswood Power'
                            width={100}
                            height={100}
                            className='w-40 h-40 my-2'
                        />
                        <Image
                            src={agent.compliance.cac_certificate}
                            alt='Rokswood Power'
                            width={100}
                            height={100}
                            className='w-40 h-40 my-2'
                        />
                        <Image
                            src={agent.compliance.government_issued_id}
                            alt='Rokswood Power'
                            width={100}
                            height={100}
                            className='w-40 h-40 my-2'
                        />
                        
                    </div>
                    
                </div>
                <div className='w-full h-[40%] py-5 border-b-2 border-neutral1'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>chart summary</h1>
                    <div className="flex space-x-4 my-4">
                        {serviceTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setServiceType(type)}
                                className={`px-4 py-2 font-semibold ${serviceType === type ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-lg`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    {graphDetails.length > 0 ? (
                        <GraphSlider graphDetails={graphDetails} id={id} />
                    ) : (
                        <p>Loading graph data...</p>
                    )}
                </div>
                <div className='w-full py-5 border-b-2 border-neutral1 gap-5'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase mb-8'>table data</h1>
                    <Tabs
                        title1='orders'
                        title2='meters'
                        title3='installations'
                        title4='prices'
                        content1={<Orders id={id}/>}
                        content2={<Meters id={id}/>}
                        content3={<Installations id={id}/>}
                        content4={<Prices id={id}/>}
                    />
                </div>
            </div>
        </section>
    );
};

export default AgentDetail;
