import axios from 'axios';
import { useEffect, useState } from 'react';
import ModalBox from '../ModalBOX';
import PreviewFile from '../previewFIle';

// eslint-disable-next-line react/prop-types
function AutoDetecKeyword({ isDarkMode }) {
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
    const [showPreview, setShowPreview] = useState(false);
    const [convertedFiles, setConvertedFiles] = useState([]); // State untuk menyimpan file yang sudah dikonversi

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
                detectKeywords(content);
            };
            reader.readAsText(file);

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

            if (line.includes('AAA')) {
                line = line.replace('AAA', '').trim();
            }

            if (!phoneNumberRegex.test(line) && i < lines.length - 1) {
                let nextLine = lines[i + 1].trim();

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

    const handlePreviewClose = () => setShowPreview(false);
    const handlePreviewShow = () => setShowPreview(true);

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

    const handleConvert = () => {
        const { vcfContentAdminNavy, vcfContentMember } = convertToVcf(fileContent || fileExample);

        const newConvertedFiles = [];

        if (vcfContentAdminNavy) {
            newConvertedFiles.push({
                content: vcfContentAdminNavy,
                fileName: adminNavyFileName,
                contactNames: [adminName, navyName], // Menyimpan semua nama kontak
                keywords: [adminKeyword, navyKeyword] // Menyimpan semua keyword
            });
        }
        if (vcfContentMember && memberKeyword) {
            newConvertedFiles.push({
                content: vcfContentMember,
                fileName: memberFileName,
                contactNames: [memberName], // Menyimpan semua nama kontak
                keywords: [memberKeyword] // Menyimpan semua keyword
            });
        }

        setConvertedFiles([...convertedFiles, ...newConvertedFiles]);
    };

    const handleDeleteFile = (index) => {
        const updatedFiles = convertedFiles.filter((_, i) => i !== index);
        setConvertedFiles(updatedFiles);
    };

    const handleDownloadAll = () => {
        convertedFiles.forEach(file => {
            const blob = new Blob([file.content], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = file.fileName;
            link.click();
            URL.revokeObjectURL(url);
        });

        setConvertedFiles([]);
    };

    return (
        <div>
            <div className="p-4 border-2 border-[#dedede] rounded-lg w-max">
                <div className="p-2">
                    <h1 className={`font-bold text-xl pb-4 text-center ${isDarkMode ? 'text-white' : ''}`}>Auto Detect Keyword</h1>
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

                    <div className="pt-4 flex justify-between items-center">
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
                            onClick={fileName ? handlePreviewShow : null}
                        >
                            {fileName ? ` ${fileName}` : 'No file selected'}
                        </span>
                        {filePreview && (
                            <PreviewFile show={showPreview} handleClose={handlePreviewClose} fileContent={fileContent} />
                        )}
                    </div>

                    <div className="text-center pt-4">
                        {convertedFiles.length > 0 && (
                            <div className="my-4">
                                <h2 className={`font-semibold ${isDarkMode ? 'text-white' : ''}`}>Converted Files</h2>
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-4 py-2">File Name</th>
                                            <th className="px-4 py-2">Contact Names</th>
                                            <th className="px-4 py-2">Keywords</th>
                                            <th className="px-4 py-2">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {convertedFiles.map((file, index) => (
                                            <tr key={index} className="bg-white text-gray-700">
                                                <td className="border px-4 py-2">{file.fileName}</td>
                                                <td className="border px-4 py-2">
                                                    {file.contactNames.join(', ')}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {file.keywords.join(', ')}
                                                </td>
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
                                className="bg-yellow-500 w-1/2 font-medium text-white py-2 px-4 rounded-md"
                                onClick={handleConvert}
                            >
                                Convert
                            </button>
                            <button
                                className="bg-green-500 w-1/2 font-medium text-white py-2 px-4 rounded-md"
                                onClick={handleDownloadAll}
                                disabled={convertedFiles.length === 0}
                            >
                                Download {convertedFiles.length} {convertedFiles.length === 1 ? 'file' : 'files'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AutoDetecKeyword;
