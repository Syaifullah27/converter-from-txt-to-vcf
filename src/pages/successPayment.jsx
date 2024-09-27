import { Link } from "react-router-dom"

const SuccessPayment = () => {
    return (
        <div className="flex gap-2 flex-col justify-center items-center h-screen border">
            <h1 className="text-3xl text-black font-medium">Payment Success</h1>
            <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <Link to="/" className="text-black font-medium underline">
                    Kembali
                </Link>
            </div>
        </div>
    )
}

export default SuccessPayment