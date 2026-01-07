import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Playlist, Snapshot, Track } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { Music } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface SidebarProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    },
    tracks: Track[],
    playlistsData: Playlist[],
    allSnapshotsData: { data: Snapshot[] },
    userId: string | null
    isFeatured: boolean;
}

const Sidebar = ({ playlistsData, playlistData, tracks, allSnapshotsData, userId, isFeatured }: SidebarProps) => {
    const currPlaylist = playlistData.data;
    console.log(currPlaylist.trackingStartDate, formatDate(currPlaylist.trackingStartDate!));
    return (
        <div className="space-y-6">
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-6">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Playlist Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between">
                        <span className="text-slate-400">Total Tracks</span>
                        <span className="text-white font-medium">{tracks?.length}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400">Updated</span>
                        <span className="text-white font-medium">Weekly</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-slate-400">Snapshots</span>
                        <span className="text-white font-medium">{(currPlaylist?.isTrackedBy === userId || isFeatured) ? allSnapshotsData?.data?.length : 0}</span>
                    </div>
                    {currPlaylist?.isTracked && (currPlaylist?.isTrackedBy === userId || isFeatured) && (
                        <div className="flex justify-between">
                            <span className="text-slate-400">Tracking Start Date</span>
                            <span className="text-white font-medium">{currPlaylist?.trackingStartDate && formatDate(currPlaylist?.trackingStartDate)}</span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Similar Playlists */}
            <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Similar Playlists</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {playlistsData.map((playlist: Playlist, index: number) => (
                        playlist?.playlistId !== currPlaylist?.playlistId && (
                            <Link key={index} href={`/playlists/${playlist?.playlistId}`}>
                                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                        <Music className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-medium">{playlist?.name}</p>
                                    </div>
                                </div>
                            </Link>
                        )
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}

export default Sidebar