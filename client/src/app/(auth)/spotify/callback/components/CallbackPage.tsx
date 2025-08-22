"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils'
import { ArrowRight, CheckCircle, CircleX, Music } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const CallbackPage = ({ user }: { user: User }) => {
    const router = useRouter();
    const [progress, setProgress] = useState(10)


    useEffect(() => {
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    }, [])

    if (!user) {
        setTimeout(() => {
            router.push('/login')
        }, 500);
    } else {
        setTimeout(() => {
            router.push('/')
        }, 500);
    }

    return (
        <div className='m-12 backdrop-blur-xl'>

            <Card className='m-auto w-1/3 p-8 backdrop-blur-xl bg-white/10 min-w-xs'>
                <div className='flex flex-col justify-center w-full gap-4'>
                    <div className='flex flex-col gap-5 justify-center items-center'>
                        <div className='flex bg-green-400 rounded-full w-20 h-20 justify-center items-center'>
                            <Music className='size-10' />
                        </div>
                        <h2 className='text-2xl font-semibold'>PlaylistTracker</h2>
                        <Progress value={progress} className={`${progress}`} />
                    </div>
                    {user ? (
                        <div className='flex flex-col gap-6 justify-center items-center'>
                            <div className='flex items-center justify-center p-4 bg-green-400/30 rounded-full'>
                                <CheckCircle className='size-8 text-green-300 animate-pulse' />
                            </div>
                            <div className='flex flex-col gap-1 items-center text-center'>
                                <p className='text-xl font-bold'>Welcome to PlaylistTracker!</p>
                                <p className='font-medium text-gray-300'>Successfully connected to Spotify!</p>
                            </div>
                            <div className='flex gap-2 items-center border border-gray-500 shadow-md py-4 px-6 rounded-md'>
                                <Avatar className="h-10 w-10 bg-purple-500">
                                    <AvatarImage src={user.userImage} alt={user.name} />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <div className='flex flex-col text-sm'>
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                            <p className='text-gray-400 flex gap-1'>
                                <span>Redirecting to Dashboard...</span>
                                <ArrowRight />
                            </p>
                        </div>
                    ) : (
                        <div className='flex flex-col gap-6 justify-center items-center'>
                            <div className='flex items-center justify-center p-4 bg-red-400/40 rounded-full'>
                                <CircleX className='size-8 text-red-300 animate-pulse' />
                            </div>
                            <div className='flex flex-col gap-1 items-center text-center'>
                                <p className='text-xl font-bold'>Authentication Failed!</p>
                                <p className='font-medium text-gray-300'>Connection failed. Please check your internet connection and try again.</p>
                            </div>
                            <p className='text-gray-400 flex gap-1'>
                                <span>Redirecting...</span>
                                <ArrowRight />
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    )
}

export default CallbackPage