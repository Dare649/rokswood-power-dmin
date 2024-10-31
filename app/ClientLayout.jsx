'use client'; // Ensure this component is a client component

import { useAuthContext } from '@/app/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from next/navigation
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/topbar'; // Ensure the correct import path

const ClientLayout = ({ children }) => {
    const { token } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            router.push('/'); // Redirect to login if no token
        }
    }, [token, router]);

    // If there's no token, return null or a loading state
    if (!token) {
        return null; // You could also return a loading spinner if preferred
    }

    return (
        <div className="flex flex-col h-screen">
            <Topbar />
            <div className="flex flex-1">
                <div className="hidden lg:flex lg:w-[20%] bg-white border-r border-neutral2">
                    <Sidebar />
                </div>
                <main className="flex-1 p-5 overflow-auto mt-20">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default ClientLayout;
