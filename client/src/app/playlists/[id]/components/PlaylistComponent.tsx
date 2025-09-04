"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Play,
    Camera,
    Music,
    Share2,
} from "lucide-react"
import { Playlist, Track, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import { trackPlaylist, stopTracker } from "@/services/trackPlaylist"
import { useRouter } from "next/navigation"


interface PlaylistDetailPageProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    }
    playlistsData: Playlist[]
    currUser: User
}


const mockTrackingData = {
    isTracking: false,
    lastSnapshot: "2025-01-10T10:00:00Z",
    totalSnapshots: 12,
    weeklyChange: "+5 tracks",
    nextSnapshot: "2025-01-19T10:00:00Z",
}

export default function PlaylistPage({ playlistData, playlistsData, currUser }: PlaylistDetailPageProps) {
    const [isTracking, setIsTracking] = useState(false);
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const playlist = playlistData.data;
    const tracks = playlistData.tracks;
    const isUserPlaylist = playlist.userId !== null

    const handleTracker = async () => {
        if (!currUser) {
            router.push('/login')
        }
        setIsLoading(true);
        try {
            if (!isTracking) {
                await trackPlaylist(playlist.playlistId, currUser.id)
                setIsTracking(true)
                setShowTrackingDialog(false)
            } else {
                await stopTracker(playlist.playlistId, currUser.id)
                setIsTracking(false)
            }

        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    className="flex flex-col lg:flex-row gap-8 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flex-shrink-0">
                        <Image
                            height={600}
                            width={600}
                            src={playlist.image || "/placeholder.svg"}
                            alt={playlist.name || 'playlistimg'}
                            className="w-80 h-80 object-cover rounded-lg shadow-2xl"
                        />
                    </div>

                    <div className="flex-1 space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                                    {isUserPlaylist ? "User Playlist" : "Chart"}
                                </Badge>
                                {isTracking && (
                                    <Badge variant="secondary" className="bg-green-600/20 text-green-300">
                                        <Camera className="h-3 w-3 mr-1" />
                                        Tracking
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{playlist.name}</h1>

                            <p className="text-lg text-slate-300 leading-relaxed mb-6">{playlist.description}</p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400 mb-6">
                                <div className="flex items-center">
                                    <Music className="h-4 w-4 mr-2" />
                                    {tracks.length} tracks
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">
                                <Button
                                    size="lg"
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-8"
                                    onClick={() => window.open(playlist.url, "_blank")}
                                >
                                    <Play className="mr-2 h-5 w-5" />
                                    Play on Spotify
                                </Button>

                                {!isTracking && (
                                    <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                className={`border-white/20 ${isTracking
                                                    ? "bg-green-600/20 text-green-400 border-green-400/20"
                                                    : "text-white hover:bg-white/10"
                                                    }`}
                                            >
                                                <Camera className="mr-2 h-5 w-5" />
                                                {isTracking ? "Tracking" : "Start Tracking"}
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-800 border-white/10">
                                            <DialogHeader>
                                                <DialogTitle className="text-white">Start Tracking Playlist</DialogTitle>
                                                <DialogDescription className="text-slate-300">
                                                    Track changes to this playlist over time. We'll take weekly snapshots and show you how it
                                                    evolves.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                                <Alert className="border-purple-500/20 bg-purple-500/10">
                                                    <Camera className="h-4 w-4 text-purple-400" />
                                                    <AlertDescription className="text-purple-300">
                                                        We'll automatically take snapshots every week and notify you of changes.
                                                    </AlertDescription>
                                                </Alert>
                                                <div className="text-sm text-slate-400">
                                                    <p>• Weekly snapshots of track changes</p>
                                                    {/* <p>• Notifications for major updates</p> */}
                                                    <p>• Historical trends and data</p>
                                                    <p>• Export tracking data anytime</p>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowTrackingDialog(false)}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleTracker}
                                                    disabled={isLoading}
                                                    className="bg-purple-600 hover:bg-purple-500"
                                                >
                                                    {isLoading ? "Starting..." : "Start Tracking"}
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                )}
                                {isTracking && (
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={handleTracker}
                                        className="bg-green-600/20 text-green-400 border-green-400/20 cursor-pointer">
                                        <Camera className="mr-2 h-5 w-5" />
                                        Stop Tracking
                                    </Button>
                                )}
                                <Button
                                    className="text-white hover:text-white border-white/20 hover:bg-white/10 px-8"
                                    variant="outline"
                                    size="lg"
                                >
                                    Share {" "} <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Music className="h-5 w-5 mr-2" />
                                    Recent Tracks
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {tracks.map((track: Track, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium">{track.title}</p>
                                                <p className="text-sm text-slate-400">
                                                    {track.artist.map((artist: string, index: number) =>
                                                        <span key={index}>
                                                            {artist}
                                                            {(track.artist.length > 1 && index < track.artist.length - 1) && ', '}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                            <Play className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Tracking History (if tracking) */}
                        {/* {isTracking && (
                            <Card className="bg-white/5 backdrop-blur-md border border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white flex items-center">
                                        <BarChart3 className="h-5 w-5 mr-2" />
                                        Tracking History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {[
                                            { date: "2025-01-10", changes: "+3 tracks", type: "addition" },
                                            { date: "2025-01-03", changes: "-1 track, +2 tracks", type: "mixed" },
                                            { date: "2024-12-27", changes: "+5 tracks", type: "addition" },
                                        ].map((snapshot, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-purple-400 rounded-full" />
                                                    <div>
                                                        <p className="text-white font-medium">{formatDate(snapshot.date)}</p>
                                                        <p className="text-sm text-slate-400">{snapshot.changes}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                                                    View Details
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )} */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-6">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Playlist Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Total Tracks</span>
                                    <span className="text-white font-medium">{tracks.length}</span>
                                </div>
                                {/* <div className="flex justify-between">
                                    <span className="text-slate-400">Genre</span>
                                    <span className="text-white font-medium">Afrobeats</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Country</span>
                                    <span className="text-white font-medium">Nigeria</span>
                                </div> */}
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Updated</span>
                                    <span className="text-white font-medium">Weekly</span>
                                </div>
                                {/* <Separator className="bg-white/10" />
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Playlist ID</span>
                                    <span className="text-white font-mono text-sm">{playlist.playlistId}...</span>
                                </div> */}
                            </CardContent>
                        </Card>

                        {/* Similar Playlists */}
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                            <CardHeader>
                                <CardTitle className="text-white text-lg">Similar Playlists</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {playlistsData.map((playlist: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                                            <Music className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-medium">{playlist.name}</p>
                                            {/* <p className="text-sm text-slate-400">{playlist.tracks}</p> */}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
