import { MdOutlineDashboard } from "react-icons/md";
import { GrUserWorker } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa";
import { LuPackageCheck } from "react-icons/lu";
import { IoSettingsOutline, IoSpeedometerOutline, IoBarChartOutline } from "react-icons/io5";
import { BiCylinder } from "react-icons/bi";

export const nav = [
    {
        title: 'dashboard',
        icon: <MdOutlineDashboard size={25}/>,
        path: '/dashboard',
        id: 1
    },
    {
        title: 'agents',
        icon: <GrUserWorker size={25}/>,
        path: '/agents',
        id: 2
    },
    {
        title: 'agents requests',
        icon: <GrUserWorker size={25}/>,
        path: '/agents-requests',
        id: 3
    },
    {
        title: 'users',
        icon: <FaRegUser size={25}/>,
        path: '/users',
        id: 4
    },
    {
        title: 'orders',
        icon: <LuPackageCheck size={25}/>,
        path: '/orders',
        id: 5
    },
    {
        title: 'transactions',
        icon: <IoBarChartOutline size={25}/>,
        path: '/transactions',
        id: 6
    },
    {
        title: 'meters',
        icon: <IoSpeedometerOutline size={25}/>,
        path: '/meters',
        id: 7
    },
    {
        title: 'cylinders',
        icon: <BiCylinder size={25}/>,
        path: '/cylinders',
        id: 8
    },
    {
        title: 'settings',
        icon: <IoSettingsOutline size={25}/>,
        path: '/settings',
        id: 9
    },
    
]