import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {PdfViewerProps} from "@/types/common";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const PdfViewer: React.FC<PdfViewerProps> = ({ url, onClose, title = '문서 뷰어' }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const viewerContent = (
    <>
      {/* Background Overlay */}
      <div className="fixed inset-0 z-50 bg-black bg-opacity-75" />

      {/* Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="relative w-[95vw] max-w-4xl h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-gray-100 border-b">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <button
                  onClick={onClose}
                  className="px-4 py-2 text-lg font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
              >
                  닫기
              </button>
          </div>
          <div className="overflow-y-auto h-full pb-16">
            <Document
              file={url}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="flex justify-center items-center h-full">로딩 중...</div>}
              error={<div className="flex justify-center items-center h-full text-red-500">PDF를 불러오는데 실패했습니다.</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="flex justify-center"
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(viewerContent, document.body);
};

export default PdfViewer;