import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalBox from '../ModalBOX';

function App() {
    const [fileContent, setFileContent] = useState('');
    const [contactName, setContactName] = useState('contact');
    const [fileName, setFileName] = useState('file.vcf');
    const [fileExample, setFileExample] = useState('');
    const [show, setShow] = useState(false);
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name);
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

    const handleDownload = () => {
        const vcfContent = convertToVcf(fileContent);
        const blob = new Blob([vcfContent], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        // Memastikan nama file tidak memiliki ".vcf" dua kali
        let downloadFileName = fileName;
        if (downloadFileName.toLowerCase().endsWith('.vcf.vcf')) {
            downloadFileName = downloadFileName.slice(0, -4);
        } else if (!downloadFileName.toLowerCase().endsWith('.vcf')) {
            downloadFileName += '.vcf';
        }

        link.href = url;
        link.download = downloadFileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        <div className="border-2 border-[#dedede] p-4 h-max">
            <div className="p-2">
                <h1 className='font-bold text-xl pb-4 text-center'>Only Number with AAA</h1>
                <button
                    onClick={show ? handleClose : handleShow}
                    className="bg-blue-500 text-[#f5f5f5] p-2 px-2 rounded-md pb-2"
                >
                    {show ? 'Example File' : 'Example File'}
                </button>
                <p className="text-sm italic text-blue-800">*Click the button to open file Example.</p>
                <ModalBox show={show} handleClose={handleClose} fileContent={fileExample} />
            </div>
            <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <label className='font-medium'>
                        Contact Name
                    </label>
                    <input type="text" value={contactName} onChange={handleContactNameChange}
                        placeholder='Contact Name'
                        className='border border-[#dedede] p-2 rounded-md placeholder:text-sm' />
                </div>
                <div className='flex flex-col gap-2'>
                    <label className='font-medium'>
                        File Name
                    </label>
                    <input type="text" value={fileName} onChange={handleFileNameChange}
                        placeholder='File Name'
                        className='border border-[#dedede] p-2 rounded-md placeholder:text-sm' />
                </div>
            </div>
            <div className='flex flex-col gap-4 pt-5'>
                <div className="flex items-center gap-2">
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
                    <span className="text-sm text-gray-700 border border-[#dedede] flex justify-center items-center p-2 rounded-md">
                        {selectedFileName ? ` ${selectedFileName}` : 'No file selected'}
                    </span>
                </div>
                {fileContent && (
                    <button
                        className="bg-green-500 text-white p-2 px-4 rounded-md"
                        onClick={handleDownload}>
                        Convert and Download VCF
                    </button>
                )}
            </div>
        </div>
    );
}

export default App;
