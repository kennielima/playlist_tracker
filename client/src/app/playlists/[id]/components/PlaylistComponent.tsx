"use client"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Play,
    Music,
    Download,
} from "lucide-react"
import { Playlist, Snapshot, SnapshotTrack, Track, User } from "@/lib/types"
import { formatDate } from "@/lib/utils"
import { startTracker, stopTracker } from "@/services/trackPlaylist"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Search from "@/components/Search"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getSnapshots, getSnapshotById } from "@/services/getSnapshots"
import Sidebar from "./Sidebar"
import PlaylistHeader from "./Header"


interface PlaylistDetailPageProps {
    playlistData: {
        data: Playlist;
        tracks: Track[]
    }
    playlistsData: Playlist[]
    currUser: User,
    // snapshots: Snapshot[]
}

export default function PlaylistPage({ playlistData, playlistsData, currUser }: PlaylistDetailPageProps) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: playlist, tracks } = playlistData;
    const isUserPlaylist = playlist.userId !== null;

    const [isTracking, setIsTracking] = useState(playlist.isTracked);
    const [isTrackedBy, setIsTrackedBy] = useState(playlist.isTrackedBy);
    const [showTrackingDialog, setShowTrackingDialog] = useState(false);

    //fetch snapshots if tracking
    const { data: allSnapshotsData, isLoading: snapshotsLoading } = useQuery({
        queryKey: ['snapshots', playlist.playlistId],
        queryFn: () => getSnapshots(playlist.playlistId),
        enabled: !!playlist.playlistId,
    })

    // set initial snapdata snd date if tracking
    const formattedFirstSnapDate = isTracking && allSnapshotsData?.data?.[0]?.createdAt ? formatDate(allSnapshotsData.data[0].createdAt) : '';
    const formattedFirstSnapData = isTracking && allSnapshotsData?.data?.[0] ? allSnapshotsData?.data?.[0] : null;

    const [snapshotDate, setSnapshotDate] = useState<string>(formattedFirstSnapDate);
    const [snapshotData, setSnapshotData] = useState(formattedFirstSnapData);
    const [snapTracks, setSnapTracks] = useState<Track[] | SnapshotTrack[] | any>(tracks);
    // const [snapshotTracks, setSnapshotTracks] = useState<>([]);
    // const [currPlaylist, setCurrPlaylist] = useState(playlist);


    // render initial snapdata and date if tracking
    useEffect(() => {
        if (formattedFirstSnapDate && snapshotDate === '') {
            setSnapshotDate(formattedFirstSnapDate);
        }
    }, [formattedFirstSnapDate, snapshotDate]);

    useEffect(() => {
        if (formattedFirstSnapData && (snapshotData === undefined || snapshotData === null)) {
            setSnapshotData(formattedFirstSnapData);
        }
    }, [formattedFirstSnapData, snapshotData]);

    const { data: snapshotDetails, isLoading: snapshotIsLoading } = useQuery({
        queryKey: ['snapshot', playlist?.playlistId, snapshotData?.id],
        queryFn: () => getSnapshotById(playlist?.playlistId, snapshotData?.id),
        enabled: !!snapshotData,
        refetchOnMount: true,
        // staleTime: 0
    })
    useEffect(() => {
        if (snapshotDetails?.data?.tracks) {
            setSnapTracks(snapshotDetails.data.tracks);
        }
    }, [snapshotDetails]);

    const startTrackerMutation = useMutation({
        mutationFn: (playlistId: string) => startTracker(playlistId),
        onSuccess: (data) => {
            console.log('Start tracker success:', data);
            setIsTracking(true);
            setShowTrackingDialog(false);

            if (data?.snapshot) {
                setSnapshotData(data.snapshot);
                setSnapshotDate(formatDate(data.snapshot.createdAt));
                // setCurrPlaylist(data.updatedPlaylist);
                setIsTrackedBy(data.isTrackedBy);
            } else {
                console.log('No snapshot in response');
            }
            // Invalidate queries to refetch snapshots list
            queryClient.invalidateQueries({ queryKey: ['snapshots', playlist.playlistId] });
        },
        onError: (error) => {
            console.error('Start tracker error:', error);
        }
    });

    const stopTrackerMutation = useMutation({
        mutationFn: (playlistId: string) => stopTracker(playlistId),
        onSuccess: () => {
            setIsTracking(false);
            queryClient.invalidateQueries({ queryKey: ['snapshots', playlist.playlistId] });
        },
        onError: (error) => {
            console.error('Stop tracker error:', error);
        }
    });

    const handleTracker = () => {
        if (!currUser) {
            router.push('/login');
            return;
        }
        if (!isTracking) {
            startTrackerMutation.mutate(playlist.playlistId);
        } else {
            stopTrackerMutation.mutate(playlist.playlistId);
        }
    }

    const handleChangeSnapshot = (snapshotId: string) => {
        const selectedSnapshot = allSnapshotsData?.data.find((s: Snapshot) => s.id === snapshotId);
        if (selectedSnapshot) {
            setSnapshotDate(formatDate(selectedSnapshot.createdAt));
            setSnapshotData(selectedSnapshot);
            queryClient.invalidateQueries({ queryKey: ['snapshot', playlist?.playlistId, selectedSnapshot.id] });
        }
    }

    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <PlaylistHeader
                    playlist={playlist}
                    isUserPlaylist={isUserPlaylist}
                    isTracking={isTracking}
                    currUser={currUser}
                    isTrackedBy={isTrackedBy}
                    showTrackingDialog={showTrackingDialog}
                    setShowTrackingDialog={setShowTrackingDialog}
                    tracks={tracks}
                    snapshotsLoading={snapshotsLoading}
                    handleTracker={handleTracker}
                />

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className={`flex items-center space-x-5 justify-between w-full ${!isTracking && "flex-row-reverse gap-4"}`}>
                            {isTracking && (currUser?.id === isTrackedBy) && (
                                <Select
                                    value={snapshotData?.id || ""}
                                    onValueChange={(snapshotId) => handleChangeSnapshot(snapshotId)}
                                >
                                    <SelectTrigger className="w-36 h-12 bg-white/5 border-white/10 text-white">
                                        <SelectValue placeholder={snapshotData ? formatDate(snapshotData.createdAt) : ""} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10">
                                        {allSnapshotsData?.data?.map((snapshot: Snapshot) => (
                                            <SelectItem
                                                key={snapshot.id}
                                                value={snapshot.id}>
                                                {formatDate(snapshot.createdAt)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                                <Download className="h-4 w-4" />
                                Export
                            </Button>
                            <Search category={'track'} />
                        </div>
                        <Card className="bg-white/5 backdrop-blur-md border border-white/10 py-8">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center">
                                    <Music className="h-5 w-5 mr-2" />
                                    Tracks
                                </CardTitle>

                            </CardHeader>
                            <CardContent className="space-y-4">
                                {!isTracking &&
                                    (snapTracks?.map((track: Track, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{track.name}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {track?.artists?.map((artist: string, index: number) =>
                                                            <span key={index}>
                                                                {artist}
                                                                {(track.artists.length > 1 && index < track.artists.length - 1) && ', '}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )))
                                }
                                {isTracking &&
                                    (snapTracks?.map((track: SnapshotTrack) => (
                                        <div
                                            key={track.rank}
                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-purple-600/20 rounded flex items-center justify-center text-purple-300 text-sm font-medium">
                                                    {track.rank}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{track?.track?.name}</p>
                                                    <p className="text-sm text-slate-400">
                                                        {track?.track?.artists?.map((artist: string, index: number) =>
                                                            <span key={index}>
                                                                {artist}
                                                                {(track?.track?.artists.length > 1 && index < track?.track?.artists.length - 1) && ', '}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )))}
                            </CardContent>
                        </Card>
                    </div>

                    <Sidebar playlistsData={playlistsData} playlistData={playlistData} tracks={tracks} allSnapshotsData={allSnapshotsData} />
                </div>
            </div>
        </div >
    )
}
