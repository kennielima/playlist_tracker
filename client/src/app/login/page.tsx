import { Card } from "@/components/ui/card"
import React from 'react'

const page = () => {
    // const [isLoading, setIsLoading] = useState(false);

    // const handleSpotifyLogin = async () => {
    //     setIsLoading(true);
    //     try {
    //         const response = await fetch(`${process.env.API_URL}/api/auth/spotify/login`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         })
    //         if (!response || !response.ok) {
    //             throw new Error('Failed to login to Spotify');
    //         }
    //         const data = response.url;
    //         return window.location.href = data;
    //     }
    //     catch (error) {
    //         console.error('Error during Spotify login:', error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <div className='flex flex-col gap-12 my-20 items-center min-h-screen'>
            <h3 className="text-3xl font-bold text-white">Welcome Back</h3>

            <Card className="w-full max-w-sm backdrop-blur-xl mt-20 shadow-2xl p-8">
                <div className="text-center space-y-6">
                    <div className="space-y-2">
                        <p className="text-slate-300">Connect with Spotify to get started</p>
                    </div>

                    {/* Spotify Login Button */}
                    <a
                        href={'/api/auth/spotify/login'}
                        className="w-full"
                    >
                        <div
                            className="group relative w-full bg-green-500 hover:bg-green-400 disabled:bg-green-600 text-white font-semibold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/25 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-center gap-3">
                                {/* {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Connecting...</span>
                                    </>
                                ) : (
                                    <> */}
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.297.539-1.02.718-1.559.42z" />
                                </svg>
                                <span>Continue with Spotify</span>
                                {/* </> */}
                                {/* )} */}
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                    </a>
                </div>
            </Card>
        </div>
    )
}

export default page