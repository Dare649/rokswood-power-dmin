"use client";
import { useEffect, useState } from 'react';
import { axiosClient } from '@/axios';
import { useRouter, useParams } from 'next/navigation'; 
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Swal from 'sweetalert2';
import Image from 'next/image';
import user from '@/public/images/user.png';


const AgentDetail = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params || {};
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (!id) return;
    
        const fetchAgent = async () => {
            try {
                const response = await axiosClient.get(`/v1/manage/agents/requests/${id}`);
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
    
        fetchAgent();    
    }, [id]);
    
  
    // Function to approve agent
    const handleApproveAgent = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.put(`/v1/manage/agents/requests/${id}/approve`);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            });
           
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Function to approve agent
    const handleDeleteAgentReuest = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.delete(`/v1/manage/agents/requests/${id}`);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: response.data.message
            });
           
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response.data.message,
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


    return (
        <section className='w-full'>
            <div className='w-full flex items-center gap-5 lg:flex-row sm:flex-col'>
                <button onClick={() => router.back()} className='text-primary1 capitalize font-bold'>back to agent requests </button>
                {
                    agent.request.is_approved === false ? (
                        <button onClick={handleApproveAgent} className='bg-primary1 text-white px-3 py-0 capitalize font-bold'>approve agent</button>
                    ):(null)
                }
                <button onClick={handleDeleteAgentReuest} className='bg-red-500 text-white px-3 py-0 capitalize font-bold'>delete agent request</button>
            </div>
            <div className='w-full flex flex-col'>
       
                <div className='w-full py-5 border-b-2 border-neutral1 gap-5'>
                    <h1 className='lg:text-xl sm:text-md font-bold uppercase'>request details</h1>
                    <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 items-center my-5 px-5'>
                        <Image
                            src={agent.request.user.image_url  || user}
                            alt='Rokswood Power'
                            width={100}
                            height={100}
                            className='w-20 h-20 my-2 rounded-full'
                        />
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>name</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.request.user.name}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>serial_number</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.request.user.serial_number}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>status</h4>
                            <h2 className={`font-bold text-neutral2 capitalize ${agent.request.user.status === 'active' ? 'text-green1': 'text-orange1'}`}>{agent.request.user.status}</h2>
                        </div>
                        <div className='my-2'>
                            <h4 className='text-primary1 capitalize font-medium'>email</h4>
                            <h2 className='font-bold text-neutral2 capitalize'>{agent.request.user.email}</h2>
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
                
            </div>
        </section>
    );
};

export default AgentDetail;
