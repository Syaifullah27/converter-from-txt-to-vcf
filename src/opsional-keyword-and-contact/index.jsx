import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalBox from '../ModalBOX';
import PreviewFile from '../previewFIle';

// eslint-disable-next-line react/prop-types
function CustomKeywords({ isDarkMode }) {
    const [fileContent, setFileContent] = useState('');
    const [fileName, setFileName] = useState('');
    const [adminName, setAdminName] = useState('Admin');
    const [navyName, setNavyName] = useState('Navy');
    const [memberName, setMemberName] = useState('');
    const [adminNavyFileName, setAdminNavyFileName] = useState('AdminNavy.vcf');
    const [memberFileName, setMemberFileName] = useState('');
    const [show, setShow] = useState(false);
    const [fileExample, setFileExample] = useState('');
    const [adminKeyword, setAdminKeyword] = useState('');
    const [navyKeyword, setNavyKeyword] = useState('');
    const [memberKeyword, setMemberKeyword] = useState('');
    const [filePreview, setFilePreview] = useState('');
    const [showPreview, setShowPreview] = useState(false); // State untuk modal preview

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                setFileContent(content);
                setFilePreview(content); // Set preview content
                detectKeywords(content); // Panggil fungsi detectKeywords setelah membaca file
            };
            reader.readAsText(file);

            // Secara otomatis mengubah nama file input
            const updatedFileName = file.name.replace('.txt', '.vcf');
            setAdminNavyFileName(updatedFileName);
        }
    };

    const detectKeywords = (content) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const keywordCandidates = [];
        const phoneNumberRegex = /^\+?\d+$/;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // Hapus "AAA" dari nomor kontak sebelum memproses lebih lanjut
            if (line.includes('AAA')) {
                line = line.replace('AAA', '').trim();
            }

            // Abaikan teks yang tidak diikuti oleh nomor kontak
            if (!phoneNumberRegex.test(line) && i < lines.length - 1) {
                let nextLine = lines[i + 1].trim();

                // Hapus "AAA" dari nomor kontak berikutnya
                if (nextLine.includes('AAA')) {
                    nextLine = nextLine.replace('AAA', '').trim();
                }

                if (phoneNumberRegex.test(nextLine)) {
                    keywordCandidates.push(line);
                }
            }
        }

        if (keywordCandidates.length === 2) {
            setAdminKeyword(keywordCandidates[0]);
            setNavyKeyword(keywordCandidates[1]);
        } else if (keywordCandidates.length > 2) {
            setAdminKeyword(keywordCandidates[0]);
            setNavyKeyword(keywordCandidates[1]);
            setMemberKeyword(keywordCandidates[2]);
        }
    };

    const handlePreviewClose = () => setShowPreview(false); // Tutup modal preview
    const handlePreviewShow = () => setShowPreview(true); // Buka modal preview

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

        const phoneNumberRegex = /^\+?\d+$/;

        lines.forEach((line) => {
            // Hapus "AAA" dari nomor kontak sebelum memproses lebih lanjut
            if (line.includes('AAA')) {
                line = line.replace('AAA', '').trim();
            }

            if (!phoneNumberRegex.test(line.trim()) &&
                !line.includes(adminKeyword) &&
                !line.includes(navyKeyword) &&
                !line.includes(memberKeyword)) {
                return;
            }

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
        let finalFileName = fileName;
        if (fileName.endsWith('.vcf.vcf')) {
            finalFileName = fileName.slice(0, -4);
        } else if (!fileName.endsWith('.vcf')) {
            finalFileName = `${fileName}.vcf`;
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
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member Contact Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Member contact name"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 py-2">
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Admin/Navy File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter file name for Admin/Navy"
                                value={adminNavyFileName}
                                onChange={(e) => setAdminNavyFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter file name for Member"
                                value={memberFileName}
                                onChange={(e) => setMemberFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>

                    <div className=" pt-4 flex justify-between items-center">
                        <input
                            type="file"
                            id='fileSYH'
                            accept=".txt"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="fileSYH"
                            className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
                        >
                            Choose File
                        </label>
                        <span
                        className={`text-sm text-gray-700 border border-[#dedede] flex justify-center items-center p-2 rounded-md cursor-pointer ${isDarkMode ? 'text-gray-200' : ''}`}
                        onClick={fileName ? handlePreviewShow : null} // Tampilkan modal preview ketika diklik
                    >
                        {fileName ? ` ${fileName}` : 'No file selected'}
                    </span>
                        {filePreview && (
                            <PreviewFile show={showPreview} handleClose={handlePreviewClose} fileContent={fileContent} />
                        )}
                    </div>

                    <div className="text-center pt-4">
                        {
                            fileName && (
                                <button
                                    className="bg-green-500 w-full font-medium text-white py-2 px-4 rounded-md"
                                    onClick={handleConvertAndDownload}
                                >
                                    Convert and Download
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomKeywords;
