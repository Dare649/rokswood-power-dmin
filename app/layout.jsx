// RootLayout.jsx
'use client'; // Marking this file as a client component

import '@/styles/globals.css';
import { AuthProvider } from '@/app/context/AuthContext';
import { usePathname } from 'next/navigation'; // Use next/navigation for pathname detection
import ClientLayout from './ClientLayout';

// export const metadata = {
//     title: "Rokswood Power",
//     description: "A power metering application",
// };

const RootLayout = ({ children }) => {
    const pathname = usePathname(); // Get the current path

    return (
        <html lang="en">
            <body className="font-serif">
                <AuthProvider>
                    {pathname === '/' ? ( // Render children only for the sign-in page
                        children
                    ) : (
                        <ClientLayout>{children}</ClientLayout> // Use ClientLayout for all other pages
                    )}
                </AuthProvider>
            </body>
        </html>
    );
};

export default RootLayout;
