import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext"
import { Music2, Mail, Lock, User, Sparkles } from "lucide-react"

const Register: React.FC = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [name, setName] = useState<string>("")
    const [focusedField, setFocusedField] = useState<string>("")
    
    const navigate = useNavigate()
    const {registerUser, btnLoading} = useUserData()

    async function submitHandler(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault()
        registerUser(name, email, password, navigate)
    }

    return (
        <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Main card */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="relative backdrop-blur-xl bg-gray-900/60 border border-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Glass effect top border */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
                    
                    {/* Floating orb decoration */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>

                    <div className="relative p-8 sm:p-10">
                        {/* Logo and title */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative mb-4">
                                <div className="absolute inset-0 bg-green-500 rounded-2xl blur-xl opacity-40 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-2xl shadow-lg">
                                    <Music2 className="w-8 h-8 text-black" />
                                </div>
                            </div>
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-300 to-green-400 mb-2">
                                Join Audiffy
                            </h2>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                Create your account
                            </p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-5">
                            {/* Name input */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                                    Name
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-green-500 rounded-md blur-sm transition-opacity duration-300 ${focusedField === 'name' ? 'opacity-30' : 'opacity-0'}`}></div>
                                    <div className="relative flex items-center">
                                       
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            className="auth-input pl-12"
                                            value={name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField('')}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email input */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                                    Email or Username
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-green-500 rounded-md blur-sm transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-30' : 'opacity-0'}`}></div>
                                    <div className="relative flex items-center">
                                       
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="auth-input pl-12"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField('')}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password input */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-300 mb-2 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <div className={`absolute inset-0 bg-green-500 rounded-md blur-sm transition-opacity duration-300 ${focusedField === 'password' ? 'opacity-30' : 'opacity-0'}`}></div>
                                    <div className="relative flex items-center">
                                        
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            className="auth-input pl-12"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField('')}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={btnLoading}
                                className="auth-btn relative overflow-hidden group mt-6"
                            >
                                <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl -z-10"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    {btnLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                                            <span>Creating Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Create Account</span>
                                            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Login link */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-green-400 font-semibold hover:text-green-300 transition-colors duration-300 hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>

                        {/* Decorative bottom line */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
                    </div>
                </div>

                {/* Additional decorative elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
                    <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-green-300 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
                    <div className="absolute top-1/2 left-0 w-1 h-1 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                </div>
            </div>
        </div>
    )
}

export default Register