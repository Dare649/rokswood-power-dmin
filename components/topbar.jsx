'use client';

import React from 'react';
import Image from 'next/image';
import { useAuthContext } from '../app/context/AuthContext';
import logo from '../public/images/logo.png';
import avatar from '../public/images/user.png';

const Topbar = () => {
    const { user } = useAuthContext();
   
    return (
        <section>
            <div className='hidden lg:flex'>
                <div className='w-full z-50 bg-white fixed top-0'>
                    <div className='w-full border-b-2 border-neutral2 h-20 px-5 flex flex-row items-center justify-between py-5'>
                        <Image
                            src={logo}
                            alt="Rokswood-Power"
                            width={100} // replace with appropriate width
                            height={100} // replace with appropriate height
                            priority
                            className='w-12 h-12'
                        />
                        <div className='flex flex-row items-center gap-x-2'>
                            <div>
                                <h4 className='font-medium capitalize text-neutral2 text-right'>Welcome</h4>
                                <h2 className='font-bold capitalize text-neutral3'>
                                    {user ? user.name : 'Guest'}
                                </h2>
                            </div>
                            <div className=' rounded-full w-20 h-20 flex items-center justify-center'>
                                {user && user.image_url ? (
                                    <Image
                                        src={user.image_url}
                                        alt="User Image"
                                        width={40} // replace with appropriate width
                                        height={40} // replace with appropriate height
                                        className='rounded-full p-3'
                                    />
                                ) : (
                                    <Image
                                        src={avatar}
                                        alt="Default Avatar"
                                        width={40} // replace with appropriate width
                                        height={40} // replace with appropriate height
                                        priority
                                        className='w-20 h-20 rounded-full'
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Topbar;
