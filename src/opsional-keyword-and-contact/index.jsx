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
    const [memberName, setMemberName] = useState('Member');
    const [adminNavyFileName, setAdminNavyFileName] = useState('AdminNavy.vcf');
    const [memberFileName, setMemberFileName] = useState('Member.vcf');
    const [show, setShow] = useState(false);
    const [fileExample, setFileExample] = useState('');
    const [adminKeyword, setAdminKeyword] = useState('');
    const [navyKeyword, setNavyKeyword] = useState('');
    const [memberKeyword, setMemberKeyword] = useState('');
    const [filePreview, setFilePreview] = useState('');
    const [showPreview, setShowPreview] = useState(false);

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
                setFilePreview(content);

                // Deteksi keyword secara otomatis
                const detectedKeywords = detectKeywords(content);
                if (detectedKeywords.length === 2) {
                    setAdminKeyword(detectedKeywords[0]);
                    setNavyKeyword(detectedKeywords[1]);
                    setMemberKeyword('');
                    setMemberName('');
                    setMemberFileName('');
                } else if (detectedKeywords.length >= 3) {
                    setAdminKeyword(detectedKeywords[0]);
                    setNavyKeyword(detectedKeywords[1]);
                    setMemberKeyword(detectedKeywords[2]);
                }

                // Secara otomatis mengubah nama file input
                const updatedFileName = file.name.replace('.txt', '.vcf');
                setAdminNavyFileName(updatedFileName);
            };
            reader.readAsText(file);
        }
    };

    const detectKeywords = (content) => {
        const lines = content.split('\n').filter(line => line.trim() !== '');
        const keywords = new Set();

        lines.forEach((line) => {
            if (!/^\+?\d+$/.test(line.trim())) {
                keywords.add(line.trim());
            }
        });

        return Array.from(keywords);
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
            if (!phoneNumberRegex.test(line.trim()) &&
                !line.includes(adminKeyword) &&
                !line.includes(navyKeyword) &&
                !line.includes(memberKeyword)) {
                return;
            }

            if (line.includes('AAA')) {
                line = line.replace('AAA', '').trim();
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
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>AdminNavy File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter File Name"
                                value={adminNavyFileName}
                                onChange={(e) => setAdminNavyFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Member File Name</h3>
                            <input
                                type="text"
                                placeholder="Enter Member File Name"
                                value={memberFileName}
                                onChange={(e) => setMemberFileName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                    </div>

                    <div className="py-2">
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="p-2 rounded-md cursor-pointer border"
                        />
                        <button
                            onClick={() => setShowPreview(!showPreview)} // Toggle preview modal
                            className="bg-blue-500 text-[#f5f5f5] p-2 px-4 ml-4 rounded-md"
                        >
                            Preview
                        </button>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleConvertAndDownload}
                            className="bg-blue-500 text-[#f5f5f5] p-2 px-4 rounded-md"
                        >
                            Download
                        </button>
                    </div>
                </div>
            </div>
            <PreviewFile
                show={showPreview}
                handleClose={() => setShowPreview(false)}
                content={filePreview}
            />
        </div>
    );
}

export default CustomKeywords;
