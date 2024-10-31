"use client";
import { useState } from "react";
import Image from "next/image";
import { CiUser } from "react-icons/ci";
import { LuEye, LuEyeOff } from "react-icons/lu";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Backdrop, CircularProgress } from "@mui/material";
import { useRouter } from 'next/navigation';
import { useAuthContext } from "./context/AuthContext";
import power from '@/public/images/power.png'

const Signin = () => {
    const [passwordVisible, setPasswordVisible] = useState(true);
    const { signin } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // State to track focus
    const [usernameFocused, setUsernameFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const MySwal = withReactContent(Swal);

    // Handle toggle password visibility
    const handlePasswordToggle = () => {
        setPasswordVisible((prev) => !prev);
    };

    const validate = () => {
        const errors = {};
        if (!formData.email) {
            errors.email = "Required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!formData.password) {
            errors.password = "Password is required.";
        }
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: ""
        });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
    
        setLoading(true);
        try {
            // Pass the platform as an additional argument
            const response = await signin(formData.email, formData.password); // Replace "yourPlatform" with the actual platform value
            setLoading(false);
            MySwal.fire({
                title: "Success",
                icon: 'success',
                text: response?.data?.message
            }).then(() => {
                router.push('/dashboard');
            });
        } catch (error) {
            setLoading(false);
            MySwal.fire({
                title: "Error",
                icon: 'error',
                text: error?.response?.data?.message 
            });
        }
    };
    

    return (
        <section className="w-full h-screen">
            <div className="w-full h-full flex flex-row items-center gap-x-5 sm:py-20 lg:py-0">
                
                <Image
                    src={power}
                    alt="Roswood Power"
                    width={100}
                    height={100}
                    className="lg:w-[60%] h-full sm:w-0  hidden sm:block"
                />
             
                <div className="lg:w-[40%] sm:w-full flex items-center justify-center m-auto sm:pt-40 lg:pt-0">
                    <form
                        onSubmit={handleFormSubmit}
                        className="w-full flex flex-col items-center justify-center mx-auto lg:px-10 sm:px-5 sm:pt-40 lg:pt-0"
                    >
                        <div className="w-full">
                            <h3 className="capitalize text-black1 font-medium">Email</h3>
                            <div
                                className={`w-full flex items-center gap-x-3 p-2 border-b-2 ${usernameFocused ? "border-primary1" : "border-black1"} border-x-0 border-t-0 text-black1`}
                            >
                                <input
                                    type="text"
                                    name="email" // Added name attribute
                                    placeholder="Enter your email"
                                    className="w-full outline-none border-none"
                                    onFocus={() => setUsernameFocused(true)}
                                    onChange={handleChange}
                                    onBlur={() => setUsernameFocused(false)}
                                />
                                <CiUser className="font-bold " size={30} />
                            </div>
                            {errors.email && <p className="text-red-500">{errors.email}</p>} {/* Show email error */}
                        </div>
                        <div className="w-full my-3">
                            <h3 className="capitalize text-black1 font-medium">Password</h3>
                            <div
                                className={`w-full flex items-center gap-x-3 p-2 border-b-2 ${passwordFocused ? "border-primary1" : "border-black1"} border-x-0 border-t-0 text-black1`}
                            >
                                <input
                                    type={passwordVisible ? "password" : "text"}
                                    name="password" // Added name attribute
                                    placeholder="Enter your password"
                                    className="w-full outline-none border-none"
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    onChange={handleChange}
                                />
                                <div onClick={handlePasswordToggle} className="cursor-pointer">
                                    {passwordVisible ? (
                                        <LuEye className="" size={30} />
                                    ) : (
                                        <LuEyeOff className="" size={30} />
                                    )}
                                </div>
                            </div>
                            {errors.password && <p className="text-red-500">{errors.password}</p>} {/* Show password error */}
                        </div>
                        <button 
                            type="submit"
                            className="w-full p-3 bg-transparent hover:bg-primary1 capitalize cursor-pointer text-center border-2 border-primary1 rounded-lg text-primary1 hover:text-white">
                            {
                                loading ? 'loading...' : 'sign in'
                            }
                        </button>
                    </form>
                </div>
            </div>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </section>
    );
};

export default Signin;
