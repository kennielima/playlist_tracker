import { Button } from '@/components/ui/button';
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils';
import { Headphones } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = ({ user }: { user: User }) => {
    return (
        <div className='w-full h-24 shadow-md flex items-center justify-between px-6 bg-purple-950'>
            {/* logo */}
            <Link href='/'>
                <div className='flex gap-1 items-center justify-between'>
                    <div className='bg-green-400 p-3 w-fit rounded-lg'>
                        <Headphones className='w-6 h-6' />
                    </div>
                    <span className='font-semibold font-serif gap-0 text-sm'>Playlist <br /> Capsule</span>
                </div>
            </Link>
            {user &&
                <Link href='/users/me'>
                    <div className='w-10 h-10 rounded-full bg-purple-600 flex justify-center items-center'>
                        {user.userImage ? (
                            <Image src={user?.userImage} alt='userimg' height={40} width={40} />
                        ) : (
                            <p>{getInitials(user?.name)}</p>
                        )}
                    </div>
                </Link>
            }
            {!user && (
                <Link href='/login'>
                    <Button className='bg-purple-800 font-bold cursor-pointer'>Login</Button>
                </Link>
            )}
        </div>
    )
}

export default page