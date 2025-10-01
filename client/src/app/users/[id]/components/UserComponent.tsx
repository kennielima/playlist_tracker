"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import { Playlist, User } from '@/lib/types'
import { containerVariants, getInitials, itemVariants } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Music, Heart, Grid3X3, List, Play, MoreHorizontal, LoaderCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type UserTypeProps = {
    user: User
    playlistData: { data: Playlist[] }
    id: string
}
const UserComponent = ({ user, playlistData, id }: UserTypeProps) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const playlists = playlistData?.data

    return (
        <div className="">
            {/* Header */}
            <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12 bg-purple-500">
                                <AvatarImage src={user?.userImage || "/placeholder.svg"} alt={user?.name} />
                                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    {user?.name}
                                </h1>
                                <p className="text-sm text-slate-300">
                                    @{user?.name}
                                </p>
                            </div>
                        </div>

                        {/* Search and Controls */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex gap-2">
                                <Button
                                    variant={viewMode === "grid" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setViewMode("grid")}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                            <CardContent className="p-4 text-center">
                                <Music className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                                <div className="text-2xl font-bold text-white">
                                    {playlists?.length}
                                </div>
                                <div className="text-sm text-slate-300">
                                    Playlists
                                </div>
                            </CardContent>
                        </Card>

                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-xl">
                            <CardContent className="p-4 text-center">
                                <Music className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                                <div className="text-2xl font-bold text-white">
                                    0
                                </div>
                                <div className="text-sm text-slate-300">
                                    Snapshots
                                </div>
                            </CardContent>
                        </Card>

                    </motion.div>
                </motion.div>

                {/* Playlists Grid */}
                <motion.div
                    className={`grid gap-6 ${viewMode === "grid"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-1"
                        }`}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {playlists?.map((playlist: Playlist) => (
                        <motion.div
                            key={playlist.playlistId}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Link href={`/playlists/${playlist?.playlistId}`}>
                                <Card className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                    <CardContent className="p-0">
                                        {viewMode === "grid" ? (
                                            <div>
                                                <div className="relative overflow-hidden rounded-t-lg">
                                                    <Image
                                                        height={300}
                                                        width={300}
                                                        src={playlist.image || "/placeholder.svg"}
                                                        alt={playlist.name}
                                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                        <Button
                                                            size="icon"
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-purple-600 hover:bg-purple-500 text-white shadow-lg"
                                                        >
                                                            <Play className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-semibold text-white truncate">
                                                            {playlist.name}
                                                        </h3>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                                                        {playlist.description}
                                                    </p>
                                                    {/* <div className="flex items-center justify-between text-xs text-slate-400">
                                                    <span>{playlist.trackCount} tracks</span>
                                                    <span>{playlist.duration}</span>
                                                </div> */}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center p-4 space-x-4">
                                                <div className="relative">
                                                    <Image
                                                        height={300}
                                                        width={300}
                                                        src={playlist.image || "/placeholder.svg"}
                                                        alt={playlist.name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                    {/* {playlist.isLiked && (
                                                    <Heart className="absolute -top-1 -right-1 h-4 w-4 text-red-500 fill-current" />
                                                )} */}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-white truncate">
                                                        {playlist.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-300 truncate">
                                                        {playlist.description}
                                                    </p>
                                                    {/* <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                                                    <span>{playlist.trackCount} tracks</span>
                                                    <span>{playlist.duration}</span>
                                                    <Badge variant={playlist.isPublic ? "default" : "secondary"} className="text-xs">
                                                        {playlist.isPublic ? "Public" : "Private"}
                                                    </Badge>
                                                </div> */}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {/* <span className="text-xs text-slate-400">
                                                    {playlist.lastUpdated}
                                                </span> */}
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <Play className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </Link>

                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {playlists && playlists.length === 0 && (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <Music className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                        <h3 className="text-lg font-semibold text-white mb-2">
                            No playlists found
                        </h3>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default UserComponent