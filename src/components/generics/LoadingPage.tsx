import tccd_logo from "@/assets/TCCD_logo.svg";

const LoadingPage = () => {
    return (
        <>
            <style>{`
                @keyframes custom-bounce {
                    0%, 100% {
                        transform: translateY(0);
                        animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
                    }
                    50% {
                        transform: translateY(-8px);
                        animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
                    }
                }

                @keyframes logoLuxury {
                    0% {
                        filter: brightness(1) contrast(1) drop-shadow(0 0 15px rgba(205, 58, 56, 0.3)) saturate(1);
                        transform: scale(1) rotate(0deg);
                    }
                    25% {
                        filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 25px rgba(41, 94, 126, 0.5)) saturate(1.2);
                        transform: scale(1.05) rotate(2deg);
                    }
                    50% {
                        filter: brightness(1.4) contrast(1.3) drop-shadow(0 0 35px rgba(205, 58, 56, 0.7)) saturate(1.4);
                        transform: scale(1.08) rotate(0deg);
                    }
                    75% {
                        filter: brightness(1.2) contrast(1.2) drop-shadow(0 0 25px rgba(41, 94, 126, 0.5)) saturate(1.2);
                        transform: scale(1.05) rotate(-2deg);
                    }
                    100% {
                        filter: brightness(1) contrast(1) drop-shadow(0 0 15px rgba(205, 58, 56, 0.3)) saturate(1);
                        transform: scale(1) rotate(0deg);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px) scale(1);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px) scale(1.2);
                        opacity: 0.8;
                    }
                }

                @keyframes spinSlow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes rotateSlow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes gradientShift {
                    0%, 100% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                }

                @keyframes progressWave {
                    0% {
                        transform: translateX(-100%) scaleX(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translateX(0%) scaleX(1.5);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(100%) scaleX(1);
                        opacity: 0.8;
                    }
                }

                .animate-custom-bounce {
                    animation-name: custom-bounce;
                    animation-duration: 2s;
                    animation-iteration-count: infinite;
                }

                .animate-logo-luxury {
                    animation: logoLuxury 4s ease-in-out infinite;
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spinSlow 8s linear infinite;
                }

                .animate-rotate-slow {
                    animation: rotateSlow 12s linear infinite;
                }

                .animate-gradient-shift {
                    background-size: 300% 300%;
                    animation: gradientShift 3s ease infinite;
                }

                .animate-progress-wave {
                    animation: progressWave 2s ease-in-out infinite;
                }

                .dot-container .dot:nth-child(1) { animation-delay: 0s; }
                .dot-container .dot:nth-child(2) { animation-delay: 0.15s; }
                .dot-container .dot:nth-child(3) { animation-delay: 0.3s; }
                .dot-container .dot:nth-child(4) { animation-delay: 0.45s; }
                .dot-container .dot:nth-child(5) { animation-delay: 0.6s; }
                .dot-container .dot:nth-child(6) { animation-delay: 0.75s; }
                .dot-container .dot:nth-child(7) { animation-delay: 0.9s; }
                .dot-container .dot:nth-child(8) { animation-delay: 1.05s; }
            `}</style>
            <div className="relative min-h-screen bg-gradient-to-br from-background via-dashboard-welcome-bg to-muted-secondary overflow-hidden">
                <div className="absolute inset-0">
                    {[...Array(25)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">

                    <div className="relative mb-12">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-primary opacity-30 blur-2xl animate-spin-slow scale-150"></div>

                        <div className="absolute inset-4 rounded-full bg-gradient-to-r from-secondary via-primary to-secondary opacity-40 blur-xl animate-pulse"></div>

                        <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-8 border border-white/20 shadow-2xl">
                            <div className="relative">
                                <img
                                    src={tccd_logo}
                                    width={160}
                                    height={160}
                                    alt="TCCD logo"
                                    className="relative z-10 animate-logo-luxury drop-shadow-2xl"
                                />

                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-rotate-slow opacity-60"></div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient-shift mb-4">
                            Loading your experience...
                        </h1>

                        <p className="text-dashboard-description text-lg font-medium opacity-80">
                            Please wait while we prepare everything for you
                        </p>
                    </div>

                    <div className="relative w-80 mb-8">
                        <div className="h-2 bg-muted-secondary/30 rounded-full overflow-hidden backdrop-blur-sm">
                            <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-progress-wave"></div>
                        </div>

                        <div className="absolute -top-6 left-0 w-full flex justify-between dot-container">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="dot w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60 animate-custom-bounce"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-4 opacity-60">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 border-2 border-primary rounded-full animate-ping"
                                style={{
                                    animationDelay: `${i * 0.3}s`,
                                    animationDuration: '3s'
                                }}
                            />
                        ))}
                    </div>

                </div>

                <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 rounded-tl-lg"></div>
                <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-secondary/30 rounded-tr-lg"></div>
                <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-secondary/30 rounded-bl-lg"></div>
                <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30 rounded-br-lg"></div>
            </div>
        </>
    );
};

export default LoadingPage;
