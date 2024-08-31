import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalBox from '../ModalBOX';
import PreviewFile from '../previewFIle';

// eslint-disable-next-line react/prop-types
function App({ isDarkMode }) {
    const [fileContent, setFileContent] = useState('');
    const [contactName, setContactName] = useState('contact');
    const [fileName, setFileName] = useState('file.vcf');
    const [fileExample, setFileExample] = useState('');
    const [show, setShow] = useState(false);
    const [showPreview, setShowPreview] = useState(false); // State untuk modal preview
    const [selectedFileName, setSelectedFileName] = useState('');
    const [convertedFiles, setConvertedFiles] = useState([]); // State untuk menyimpan file yang sudah dikonversi

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const originalFileName = file.name;
            const baseName = originalFileName.replace(/\.[^/.]+$/, ''); // Menghapus ekstensi asli
            setFileName(`${baseName}.vcf`); // Mengubah nama file secara otomatis
    
            setSelectedFileName(originalFileName);
            const reader = new FileReader();
            reader.onload = (e) => {
                const filteredContent = e.target.result
                    .split('\n')
                    .map(line => {
                        // Hapus teks "AAA" dari nomor telepon dan ambil hanya nomor telepon
                        const cleanLine = line.replace(/AAA/g, '').trim();
                        // Deteksi apakah ini nomor telepon yang valid
                        if (/^\+?\d+$/.test(cleanLine)) {
                            return cleanLine;
                        }
                        return ''; // Abaikan baris yang tidak valid
                    })
                    .filter(line => line.trim() !== '');
    
                setFileContent(filteredContent.join('\n'));
                handleConvert(filteredContent.join('\n')); // Langsung convert setelah file dipilih
            };
            reader.readAsText(file);
        }
    };

    const handleContactNameChange = (event) => {
        setContactName(event.target.value);
    };

    const handleFileNameChange = (event) => {
        setFileName(event.target.value);
    };

    const convertToVcf = (content) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        let vcfContent = '';
        let contactNumber = 1;

        lines.forEach((line) => {
            vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName} ${contactNumber}\nTEL:${line.trim()}\nEND:VCARD\n`;
            contactNumber++;
        });

        return vcfContent;
    };

    const handleConvert = (content) => {
        const vcfContent = convertToVcf(content || fileContent);
        const newConvertedFile = {
            content: vcfContent,
            fileName: fileName,
            contactName: contactName
        };

        setConvertedFiles([...convertedFiles, newConvertedFile]);
    };

    const handleDownloadAll = () => {
        convertedFiles.forEach(file => {
            const blob = new Blob([file.content], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');

            let downloadFileName = file.fileName;
            if (downloadFileName.toLowerCase().endsWith('.vcf.vcf')) {
                downloadFileName = downloadFileName.slice(0, -4);
            } else if (!downloadFileName.toLowerCase().endsWith('.vcf')) {
                downloadFileName += '.vcf';
            }

            link.href = url;
            link.download = downloadFileName;
            link.click();
            URL.revokeObjectURL(url);
        });

        setConvertedFiles([]); // Reset daftar file setelah diunduh
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = convertedFiles.filter((_, i) => i !== index);
        setConvertedFiles(updatedFiles);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handlePreviewClose = () => setShowPreview(false); // Tutup modal preview
    const handlePreviewShow = () => setShowPreview(true); // Buka modal preview

    useEffect(() => {
        axios.get('/src/ExampleFile/onlyNumberWithAAA.txt', { responseType: 'text' })
            .then((response) => {
                setFileExample(response.data);
            })
            .catch((error) => {
                console.error("Error loading the default file:", error);
                setFileExample("Error loading file.");
            });
    }, []);

    return (
        <div className="border-2 border-[#dedede] rounded-lg p-4 h-max">
            <div className="pb-3">
                <h1 className={`font-bold text-xl pb-4 text-center ${isDarkMode ? 'text-white' : ''}`}>Only Number with AAA</h1>
                <button
                    onClick={show ? handleClose : handleShow}
                    className="bg-blue-500 text-[#f5f5f5] p-2 px-2 rounded-md pb-2"
                >
                    {show ? 'Example File' : 'Example File'}
                </button>
                <p className="text-sm italic text-blue-800 pt-1">*Click the button to open file Example.</p>
                <ModalBox show={show} handleClose={handleClose} fileContent={fileExample} />
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
                        Contact Name
                    </label>
                    <input type="text" value={contactName} onChange={handleContactNameChange}
                        placeholder='Contact Name'
                        className='border border-[#dedede] p-2 rounded-md placeholder:text-sm' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>
                        File Name
                    </label>
                    <input type="text" value={fileName} onChange={handleFileNameChange}
                        placeholder='File Name'
                        className='border border-[#dedede] p-2 rounded-md placeholder:text-sm' />
                </div>
            </div>
            <div className='flex flex-col gap-4 pt-7'>
                <div className="flex items-center gap-4 justify-between">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileChange}
                        id="fileInput"
                        className="hidden"
                    />
                    <label
                        htmlFor="fileInput"
                        className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                    >
                        Choose File
                    </label>
                    <span
                        className={`text-sm text-gray-700 border border-[#dedede] flex justify-center items-center p-2 rounded-md cursor-pointer ${isDarkMode ? 'text-gray-200' : ''}`}
                        onClick={selectedFileName ? handlePreviewShow : null} // Tampilkan modal preview ketika diklik
                    >
                        {selectedFileName ? ` ${selectedFileName}` : 'No file selected'}
                    </span>
                </div>

                {convertedFiles.length > 0 && (
                    <div className="my-4">
                        <h2 className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>Converted Files</h2>
                        <table className="min-w-full table-auto">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-4 py-2">File Name</th>
                                    <th className="px-4 py-2">Contact Name</th>
                                    <th className="px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {convertedFiles.map((file, index) => (
                                    <tr key={index} className="bg-white text-gray-700">
                                        <td className="border px-4 py-2">{file.fileName}</td>
                                        <td className="border px-4 py-2">{file.contactName}</td>
                                        <td className="border px-4 py-2 text-center">
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded-md"
                                                onClick={() => handleDeleteFile(index)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex gap-4">
                    <button
                        className="bg-green-500 w-full font-medium text-white py-2 px-4 rounded-md"
                        onClick={handleDownloadAll}
                        disabled={convertedFiles.length === 0}
                    >
                        Download {convertedFiles.length} {convertedFiles.length === 1 ? 'file' : 'files'}
                    </button>
                </div>
            </div>

            {/* Modal Preview */}
            <PreviewFile show={showPreview} handleClose={handlePreviewClose} fileContent={fileContent} />
        </div>
    );
}

export default App;
