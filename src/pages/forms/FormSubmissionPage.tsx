import tccd_logo from "@/assets/TCCD_logo.svg";

const FormSubmissionPage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
            <div className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 pb-16">
                <section
                    className="w-full max-w-md rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
                    aria-labelledby="submission-success-title"
                >
                    <header className="w-full flex flex-col gap-3 items-center">
                        <img src={tccd_logo} width={100} alt="TCCD logo" />
                        <h1
                            id="submission-success-title"
                            className="text-2xl font-bold text-[#3B3D41]"
                        >
                            TCCD Team
                        </h1>
                    </header>

                    <div className="mt-8 text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-xl font-bold text-[#5E6064]">
                                Thank You!
                            </h2>
                            <p className="text-[#636569] text-sm leading-relaxed">
                                Your form has been successfully submitted. We appreciate your engagement to our community.
                            </p>
                            <p className="text-[#636569] text-xs mt-4">
                                You can safely close this page now.
                            </p>
                        </div>
                    </div>

                    <footer className="mt-8 pt-6 border-t border-black/5">
                        <p className="text-center text-xs text-[#A5A9B2]">
                            Have a wonderful day!
                        </p>
                    </footer>
                </section>
            </div>
        </main>
    );
};

export default FormSubmissionPage;