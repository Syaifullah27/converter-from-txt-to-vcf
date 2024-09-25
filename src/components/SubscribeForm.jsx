import axios from 'axios';

// eslint-disable-next-line react/prop-types
const SubscriptionModal = ({ onClose, onSubscribe }) => {
    // Ambil data user dari localStorage
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;

    // Pastikan user ada sebelum mengakses _id dan email
    const userId = user ? user._id.substring(0, 5) : null;
    const email = user ? user.email : null;

    const handleSubscribe = async () => {
        if (!userId || !email) {
            console.error('User belum login atau data user tidak tersedia.');
            return; // Hentikan eksekusi jika user tidak tersedia
        }

        try {
            const response = await axios.post('http://localhost:5000/api/subscribe', {
                userId: userId, // Menggunakan 5 digit pertama dari userId
                email: email,   // Kirim email pengguna yang login
                amount: 10000,  // Sesuaikan dengan harga langganan per bulan
                duration: '1 month' // Tambahkan informasi durasi berlangganan
            });

            const data = response.data;
            console.log(data);

            if (data.token) {
                // Buka halaman transaksi di tab baru
                const transactionUrl = `https://app.sandbox.midtrans.com/snap/v2/vtweb/${data.token}`;
                window.open(transactionUrl, '_blank'); // Membuka halaman di tab baru
            } else {
                console.error('Token tidak ditemukan di respons API');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">Berlangganan VCF Converter</h2>
                <p className="mb-4">
                    VCF Converter adalah aplikasi yang memudahkan Anda mengelola kontak dengan mudah. Dengan fitur-fitur unggulan
                    seperti pengelolaan kontak massal, otomatisasi deteksi nomor telepon, dan banyak lagi.
                </p>
                <h3 className="text-xl font-bold mb-2">Harga Berlangganan</h3>
                <p className="mb-4 text-gray-700">Rp10.000/bulan</p>
                <h3 className="text-xl font-bold mb-2">Fungsi dan Benefit</h3>
                <ul className="list-disc list-inside mb-4">
                    <li>Akses penuh ke semua fitur</li>
                    <li>Pembaruan dan dukungan reguler</li>
                    <li>Otomatisasi dan integrasi dengan berbagai format kontak</li>
                </ul>
                <button
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleSubscribe}
                >
                    Berlangganan Sekarang
                </button>
            </div>
        </div>
    );
};

export default SubscriptionModal;
