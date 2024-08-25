import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalBox from '../ModalBOX';

// eslint-disable-next-line react/prop-types
function CustomKeywords({ isDarkMode }) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState(''); // State untuk menyimpan nama file
    const [adminName, setAdminName] = useState('Admin');
    const [navyName, setNavyName] = useState('Navy');
    const [memberName, setMemberName] = useState('Member');
    const [adminNavyFileName, setAdminNavyFileName] = useState('AdminNavy.vcf');
    const [memberFileName, setMemberFileName] = useState('Member.vcf');
    const [show, setShow] = useState(false);
    const [fileExample, setFileExample] = useState('');
    const [adminKeyword, setAdminKeyword] = useState('');
    const [navyKeyword, setNavyKeyword] = useState('');
    const [memberKeyword, setMemberKeyword] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name); // Simpan nama file ke state
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        axios.get('/src/ExampleFile/opsional-contact-keyword.txt', { responseType: 'text' })
            .then((response) => {
                setFileExample(response.data);
            })
            .catch((error) => {
                console.error("Error loading the default file:", error);
                setFileExample("Error loading file.");
            });
    }, []);

    const convertToVcf = (content) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        let vcfContentAdminNavy = '';
        let vcfContentMember = '';
        let currentContactType = ''; 
        let contactNumberAdmin = 1;
        let contactNumberNavy = 1;
        let contactNumberMember = 1;
        
        // Regular expression untuk mendeteksi nomor telepon termasuk yang mengandung tanda '+'
        const phoneNumberRegex = /^\+?\d+$/;
        
        lines.forEach((line) => {
            // Abaikan baris yang tidak mengandung keyword atau nomor telepon
            if (!phoneNumberRegex.test(line.trim()) && 
                !line.includes(adminKeyword) && 
                !line.includes(navyKeyword) && 
                !line.includes(memberKeyword)) {
                return;
            }
    
            // Jika ada 'AAA' di dalam nomor, hapus 'AAA' tersebut
            if (line.includes('AAA')) {
                line = line.replace('AAA', '').trim();
            }
    
            // Tentukan tipe kontak berdasarkan keyword
            if (adminKeyword && line.includes(adminKeyword)) {
                currentContactType = adminName || 'Admin';
                return; 
            } else if (navyKeyword && line.includes(navyKeyword)) {
                currentContactType = navyName || 'Navy';
                return; 
            } else if (memberKeyword && line.includes(memberKeyword)) {
                currentContactType = memberName || 'Member';
                return; 
            }
    
            // Hanya proses nomor telepon yang valid
            if (phoneNumberRegex.test(line.trim())) {
                let contactNumber;
                let contactName;
    
                if (currentContactType === (adminName || 'Admin')) {
                    contactNumber = contactNumberAdmin++;
                    contactName = `${adminName} ${contactNumber}`;
                } else if (currentContactType === (navyName || 'Navy')) {
                    contactNumber = contactNumberNavy++;
                    contactName = `${navyName} ${contactNumber}`;
                } else if (currentContactType === (memberName || 'Member')) {
                    contactNumber = contactNumberMember++;
                    contactName = `${memberName} ${contactNumber}`;
                }
    
                const vcfEntry = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL:${line.trim()}\nEND:VCARD\n`;
    
                if (currentContactType === (memberName || 'Member')) {
                    vcfContentMember += vcfEntry;
                } else {
                    vcfContentAdminNavy += vcfEntry;
                }
            }
        });
    
        return { vcfContentAdminNavy, vcfContentMember };
    };
    
    

    const handleDownload = (content, fileName) => {
        // Hapus ".vcf" yang berlebihan jika fileName diakhiri dengan ".vcf.vcf"
        let finalFileName = fileName;
        if (fileName.endsWith('.vcf.vcf')) {
            finalFileName = fileName.slice(0, -4); // Hilangkan ".vcf" yang kedua
        } else if (!fileName.endsWith('.vcf')) {
            finalFileName = `${fileName}.vcf`; // Tambahkan ".vcf" jika belum ada
        }
        
        const blob = new Blob([content], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = finalFileName;
        link.click();
        URL.revokeObjectURL(url);
    };
    
    const handleConvertAndDownload = () => {
        const { vcfContentAdminNavy, vcfContentMember } = convertToVcf(fileContent || fileExample);
        
        const isConfirmed = window.confirm("Are you sure the format and input are correct? If so, click OK to continue.");
        
        if (isConfirmed) {
            if (vcfContentAdminNavy) {
                handleDownload(vcfContentAdminNavy, adminNavyFileName);
            }
            if (vcfContentMember && memberKeyword) {
                handleDownload(vcfContentMember, memberFileName);
            }
        }
    };

    return (
        <div>
            <div className="p-4 border-2 border-[#dedede] rounded-lg w-max">
                <div className="p-2">
                    <h1 className={`font-bold text-xl pb-4 text-center ${isDarkMode ? 'text-white' : ''}`}>Opsional Keyword and Contact</h1>
                    <button
                        onClick={show ? handleClose : handleShow}
                        className="bg-blue-500 text-[#f5f5f5] p-2 px-2 rounded-md"
                    >
                        {show ? 'Example File' : 'Example File'}
                    </button>
                    <p className="text-sm italic text-blue-800 pt-1">*Click the button to open file Example.</p>
                    <ModalBox show={show} handleClose={handleClose} fileContent={fileExample} />
                </div>

                <div className="mt-4">
                <div className="flex gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Admin Keyword</h3>
                            <input
                                type="text"
                                placeholder="Enter Admin keyword"
                                value={adminKeyword}
                                onChange={(e) => setAdminKeyword(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Navy Keyword</h3>
                            <input
                                type="text"
                                placeholder="Enter Navy keyword"
                                value={navyKeyword}
                                onChange={(e) => setNavyKeyword(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member Keyword</h3>
                            <input
                                type="text"
                                placeholder="Enter Member keyword"
                                value={memberKeyword}
                                onChange={(e) => setMemberKeyword(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 py-2">
                        
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Admin Contact Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Admin contact name"
                                value={adminName}
                                onChange={(e) => setAdminName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Navy Contact Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Navy contact name"
                                value={navyName}
                                onChange={(e) => setNavyName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Admin/Navy File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Admin/Navy file name"
                                value={adminNavyFileName}
                                onChange={(e) => setAdminNavyFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>
                
                </div>

                <div className="mt-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member Contact Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Member contact name"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Member file name"
                                value={memberFileName}
                                onChange={(e) => setMemberFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex justify-between pt-4">
                    <label
                        htmlFor="file-upload"
                        className="bg-blue-500 text-[#f5f5f5] p-2 rounded-md cursor-pointer"
                    >
                        Choose File
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <span className={`text-sm text-gray-700 border border-[#dedede] flex justify-center items-center p-2 rounded-md ${isDarkMode ? 'text-gray-200' : ''}`}>
                    {fileName ? ` ${fileName}` : 'No file selected'}
                    </span>
                </div>

                {/* Hanya tampilkan tombol download jika fileName tidak kosong */}
                {fileName && (
                    <div className="mt-4 w-full">
                        <button
                            onClick={handleConvertAndDownload}
                            className="bg-green-500 w-full font-medium text-[#f5f5f5] p-2 px-4 rounded-md"
                        >
                            Convert and Download VCF
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomKeywords;
