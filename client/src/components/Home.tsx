"use client"
import { Playlist } from '@/lib/types'
import React from 'react'
import { motion } from 'framer-motion'
import { Music, Heart, Grid3X3, List, Play, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"

const Homepage = ({ playlistData }: { playlistData: Playlist[] }) => {
    console.log('playlistData', playlistData);
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }
    return (
        <div className="font-sans grid items-center justify-items-center p-8 pb-20 gap-16 sm:p-20">
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
                                    {playlistData.length}
                                </div>
                                <div className="text-sm text-slate-300">
                                    Playlists
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Playlists Grid */}
                <motion.div
                    className="grid gap-6 grid-cols-1 sm:grid-cols-2 "
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {playlistData.map((playlist: Playlist) => (
                        <motion.div
                            key={playlist.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card className="group cursor-pointer bg-white/5 backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl hover:bg-white/10 transition-all duration-300">
                                <CardContent className="p-0">
                                    <div className="flex items-center p-4 space-x-4">
                                        <div className="relative">
                                            <img
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
                                            <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                                                {/* <span>{playlist.trackCount} tracks</span> */}
                                                {/* <span>{playlist.duration}</span> */}
                                                {/* <Badge variant={playlist.isPublic ? "default" : "secondary"} className="text-xs">
                                                        {playlist.isPublic ? "Public" : "Private"}
                                                    </Badge> */}
                                            </div>
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
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Empty State */}
                {playlistData.length === 0 && (
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

export default Homepage