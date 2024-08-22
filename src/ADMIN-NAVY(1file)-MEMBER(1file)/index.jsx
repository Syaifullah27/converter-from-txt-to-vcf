import { useState, useEffect } from 'react';
import ModalBox from '../ModalBOX';
import axios from 'axios';

function AdminNavyMember() {
    const [fileContent, setFileContent] = useState('');
    const [adminNavyName, setAdminNavyName] = useState('admin/navy');
    const [memberName, setMemberName] = useState('member');
    const [adminNavyFileName, setAdminNavyFileName] = useState('AdminNavy.vcf');
    const [memberFileName, setMemberFileName] = useState('Member.vcf');
    const [show, setShow] = useState(false);
    const [fileExample, setFileExample] = useState('');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileContent(event.target.result);
            };
            reader.readAsText(file);
        }
    };

    useEffect(() => {
        axios.get('/src/ExampleFile/admin-navy-member.txt', { responseType: 'text' })
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
        let vcfContent1 = '';
        let vcfContent2 = '';
        let contactType = '';
        let contactNumber = 1;

        lines.forEach((line) => {
            if (line.includes('管理号') || line.includes('水军')) {
                contactType = adminNavyName;
                contactNumber = 1;
            } else if (line.includes('客户')) {
                contactType = memberName;
                contactNumber = 1;
            }

            if (!line.includes('管理号') && !line.includes('水军') && !line.includes('客户')) {
                const vcfEntry = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactType} ${contactNumber}\nTEL:${line.trim()}\nEND:VCARD\n`;
                if (contactType === memberName) {
                    vcfContent2 += vcfEntry;
                } else {
                    vcfContent1 += vcfEntry;
                }
                contactNumber++;
            }
        });

        return { vcfContent1, vcfContent2 };
    };

    const handleDownload = (content, fileName) => {
        const blob = new Blob([content], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleConvertAndDownload = () => {
        const { vcfContent1, vcfContent2 } = convertToVcf(fileContent || fileExample);
        if (vcfContent1) {
            handleDownload(vcfContent1, adminNavyFileName);
        }
        if (vcfContent2) {
            handleDownload(vcfContent2, memberFileName);
        }
    };

    return (
        <div>
            <div className="p-2 border-2 border-[#dedede] w-max">
                <div className="p-2">
                    <h1 className='font-bold text-xl pb-4 text-center'>admin and navy files are separate from members</h1>
                    <button
                        onClick={show ? handleClose : handleShow}
                        className="bg-blue-500 text-[#f5f5f5] p-2 px-2 rounded-md"
                    >
                        {show ? 'Example File' : 'Example File'}
                    </button>
                    <p className="text-sm italic text-blue-800">*Click the button to open file Example.</p>
                    <ModalBox show={show} handleClose={handleClose} fileContent={fileExample} />
                </div>


                <div className="mt-4">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium">Admin/Navy Contacts</h3>
                            <input
                                type="text"
                                placeholder="Enter Admin/Navy contact name"
                                value={adminNavyName}
                                onChange={(e) => setAdminNavyName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium">Admin/Navy File Name</h3>
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
                            <h3 className="font-medium">Member Name Contacts</h3>
                            <input
                                type="text"
                                placeholder="Enter Member contact name"
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}
                                className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-medium">Member File Name</h3>
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

                <div className="mt-4 p-2 flex gap-4 flex-col max-w-[420px]">
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="border border-[#dedede] p-2 rounded-md placeholder:text-sm"
                    />
                    {fileContent && (
                        <button
                            className="bg-blue-500 text-[#f5f5f5] p-2 px-2 rounded-md"
                            onClick={handleConvertAndDownload}
                        >
                            Download as VCF
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminNavyMember;
