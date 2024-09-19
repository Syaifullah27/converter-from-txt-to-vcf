import axios from 'axios';

// eslint-disable-next-line react/prop-types
const SubscriptionModal = ({ onClose, onSubscribe }) => {
    const handleSubscribe = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/subscribe', {
                userId: '123',
                amount: 10000, // Sesuaikan dengan harga langganan per bulan
                duration: '1 month' // Tambahkan informasi durasi berlangganan
            });

            const data = response.data;
            console.log(data);

            if (data.token) {
                window.snap.pay(data.token, {
                    onSuccess: function (result) {
                        console.log('Payment successful:', result);
                        onSubscribe(); // Callback untuk menandai sukses berlangganan
                    },
                    onPending: function (result) {
                        console.log('Payment pending:', result);
                    },
                    onError: function (result) {
                        console.error('Payment failed:', result);
                    },
                    onClose: function () {
                        console.log('Payment popup closed');
                    }
                });
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
