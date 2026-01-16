import { Button } from '@/components/ui/button';
import { User } from '@/lib/types'
import { getInitials } from '@/lib/utils';
import { Headphones } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const HeaderComponent = ({ user }: { user: User }) => {
    return (
        <div className='sticky top-0 z-10 w-full h-24 shadow-md flex items-center justify-between px-6 md:px-12 lg:px-24 bg-gradient-to-br from-slate-900 via-purple-800 to-slate-900'>
            {/* logo */}
            <Link href='/'>
                <div className='flex gap-1 items-center justify-between'>
                    <div className='bg-green-400 p-3 w-fit rounded-full'>
                        <Headphones className='w-6 h-6' />
                    </div>
                    <span className='font-semibold font-serif gap-0 text-sm'>Playlist <br /> Capsule</span>
                </div>
            </Link>
            {user &&
                <Link href='/users/me'>
                    <Avatar className="h-12 w-12 bg-purple-500">
                        <AvatarImage src={user.userImage} alt={user.name} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
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

export default HeaderComponent