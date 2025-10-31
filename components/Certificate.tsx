import React from 'react';
import Icon from './Icon';
import Button from './Button';
// Fix: Use relative path for type imports
import { CertificateDesign } from '../types';

interface CertificateProps {
  studentName: string;
  courseName: string;
  date: string;
  design?: CertificateDesign;
  previewMode?: boolean;
}

const Certificate: React.FC<CertificateProps> = ({ studentName, courseName, date, design, previewMode = false }) => {

  const defaultDesign: CertificateDesign = {
      prompt: '',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      accentColor: '#06B6D4',
      borderColor: '#374151',
      fontFamily: "'Inter', sans-serif",
      badgeColor: '#FBBF24',
  };
  
  const currentDesign = design || defaultDesign;

  const handlePrint = () => {
    const printContents = document.getElementById('certificate-to-print')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if(printContents) {
        document.body.innerHTML = `<html><head><title>Print Certificate</title></head><body>${printContents}</body></html>`;
        window.print();
        document.body.innerHTML = originalContents;
        // The modal will be gone, so we might need to reload or find a better way
        // For simplicity, this is often good enough for a print-only feature
        window.location.reload(); 
    }
  };


  return (
    <div>
        <div 
            id="certificate-to-print" 
            className="p-4 sm:p-8 rounded-lg relative text-center"
            style={{ 
                backgroundColor: currentDesign.backgroundColor, 
                color: currentDesign.textColor,
                border: `4px solid ${currentDesign.borderColor}`,
                fontFamily: currentDesign.fontFamily
            }}
        >
            <div className="absolute inset-0 border-2 m-2" style={{ borderColor: currentDesign.borderColor, opacity: 0.5 }}></div>
            <style>
                {`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #certificate-to-print, #certificate-to-print * {
                        visibility: visible;
                    }
                    #certificate-to-print {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        border-width: 10px !important; /* Ensure border prints */
                    }
                }
                `}
            </style>
            
            <div className="flex justify-center mb-4">
                <Icon name="award" className="w-16 h-16" style={{ color: currentDesign.badgeColor }} />
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-widest">
                Certificate of Completion
            </h1>
            
            <p className="text-lg mt-8">This certificate is proudly presented to</p>
            
            <p className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-4 mb-4" style={{ color: currentDesign.accentColor, fontFamily: "'Brush Script MT', cursive" }}>
                {studentName}
            </p>
            
            <p className="text-lg">for successfully completing the course</p>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mt-4 mb-8">
                {courseName}
            </h2>
            
            <div className="flex justify-between items-end mt-16 text-xs sm:text-base">
                <div className="text-left">
                    <p className="px-4 pt-2" style={{borderTop: `2px solid ${currentDesign.textColor}`}}>{date}</p>
                    <p className="font-semibold">Date</p>
                </div>
                <div className="text-right">
                    <p className="px-4 pt-2" style={{borderTop: `2px solid ${currentDesign.textColor}`}}>CourseCraft</p>
                    <p className="font-semibold">Issuing Platform</p>
                </div>
            </div>
        </div>

        {!previewMode && (
            <div className="mt-6 flex justify-end">
                <Button onClick={handlePrint}>
                    Print Certificate
                </Button>
            </div>
        )}
    </div>
  );
};

export default Certificate;