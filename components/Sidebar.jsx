'use client'

import { useState } from "react";
import { nav } from "./dummy"; // Assuming this is where your nav items are defined
import Link from "next/link";
import { MdOutlineLogout } from "react-icons/md";
import { useAuthContext } from '../app/context/AuthContext';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';


const Sidebar = () => {
    const { signout } = useAuthContext();
    const MySwal = withReactContent(Swal);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignout = () => {
        MySwal.fire({
            title: 'Are you sure you want to sign out?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, sign out!'
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                signout(() => {
                    setLoading(false);
                    router.push("/");
                });
            }
        });
    };
    return (
        <div className="w-[20%] h-full bg-white fixed top-20 left-0 border-r-2 border-neutral2">
            <div className="w-full h-full px-5">
                {
                    nav.map((item) => (
                        <Link key={item.id} href={item.path} className="w-full flex flex-row items-center gap-x-3 text-neutral1 capitalize my-1 hover:bg-primary1 hover:text-white active:bg-primary1 active:text-white p-3 font-bold">
                            {item.icon}
                            {item.title}
                        </Link>
                    ))
                }
                <div 
                    className='w-full p-3 fixed flex flex-row items-center gap-x-3 font-bold text-red-500 capitalize bottom-0'
                    onClick={handleSignout}
                >
                    <MdOutlineLogout size={25}/>
                    sign out
                </div>
            </div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

// Correct export
export default Sidebar;
