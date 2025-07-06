


import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { Document, Page, pdfjs } from "react-pdf";
import { toast } from "react-toastify";
import { DndContext } from "@dnd-kit/core";
import { Resizable } from "re-resizable";
import { assets } from "../assets/assets";
import { saveAs } from 'file-saver';
import 'react-pdf/dist/Page/AnnotationLayer.js';
import 'react-pdf/dist/Page/TextLayer.js';


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const SignaturePlaceholder = ({ id, x, y, name, onDelete, onMove, locked }) => {
  const [size, setSize] = useState({ width: 120, height: 50 });
  const handleDrag = (e) => {
    if (!locked) {
      const parent = e.target.closest(".pdf-container");
      const rect = parent.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      onMove(id, newX, newY);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 10,
        cursor: locked ? "default" : "move",
      }}
      draggable={!locked}
      onDragEnd={handleDrag}
    >


      <Resizable
        size={size}
        enable={
          !locked && {
            top: true,
            right: true,
            bottom: true,
            left: true,
            topRight: true,
            bottomRight: true,
            bottomLeft: true,
            topLeft: true,
          }
        } // disable resizing if locked
        onResizeStop={(e, direction, ref, d) => {
          if (!locked) {
            setSize((prev) => ({
              width: prev.width + d.width,
              height: prev.height + d.height,
            }));
          }
        }}
        style={{
          border: "2px dashed #007bff",
          backgroundColor: "rgba(0, 123, 255, 0.1)",
          padding: "8px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: Math.min(size.width, size.height) / 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Dancing Script', cursive, sans-serif",
            height: "100%",
          }}
        >
          {name || "Signature"}
        </div>

        {!locked && (
          <button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onDelete(id);
      }}
      onMouseDown={(e) => e.stopPropagation()}  // Prevent resize initiation
      style={{
        position: "absolute",
        top: "-12px",
        right: "-12px",
        background: "#f44336",
        color: "#fff",
        border: "2px solid #fff",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        cursor: "pointer",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        transition: "all 0.2s ease",
        ':hover': {
          transform: "scale(1.1)",
          background: "#d32f2f"
        },
        ':active': {
          transform: "scale(0.95)"
        }
      }}
      aria-label="Delete signature"
    >
      ×
    </button>
        )}
      </Resizable>

    </div>
  );
};



const DocDashboard = () => {
  const { backendUrl } = useContext(AppContent);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [numPages, setNumPages] = useState(0);
  const [signatures, setSignatures] = useState([]);
  const [signatureName, setSignatureName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/docs/my-docs`, {
          withCredentials: true,
        });
        if (data.success) setDocs(data.documents);
      } catch (error) {
        toast.error("Error fetching documents");
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, [backendUrl]);

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = e.target.elements.pdf;
    if (!fileInput.files[0]) return toast("Please select a PDF");

    const uploadedFile = fileInput.files[0];
    formData.append("pdf", uploadedFile);

    try {
      const res = await axios.post(`${backendUrl}/api/docs/uploads`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
          toast("PDF uploaded successfully");

          const newDoc = res.data.document; // or res.data.filePath, etc.
          const formattedPath = `${backendUrl}/${newDoc.filePath.replace(/\\/g, "/")}`;
          setSelectedPdfUrl(formattedPath);
          setShowEditor(true);

          // Update doc list separately if needed
          const updated = await axios.get(`${backendUrl}/api/docs/my-docs`, {
            withCredentials: true,
          });
          if (updated.data.success) {
            setDocs(updated.data.documents);
          }
        }

    } catch (error) {
      toast.error("Upload failed");
    }
  };

const handleSaveSignature = async () => {
  try {
    // 1. Validate document selection
    if (!docs.length || !selectedPdfUrl) {
      toast.error("Please select a document first");
      return;
    }

    // 2. Find current document
    const selectedFileName = selectedPdfUrl.split("/").pop();
    const currentDoc = docs.find(doc => doc.filePath?.includes(selectedFileName));
    if (!currentDoc?._id) {
      toast.error("Document not found in records");
      return;
    }

    // 3. Filter only unsaved signatures
    const unsavedSignatures = signatures.filter(sig => !sig.locked);
    if (unsavedSignatures.length === 0) {
      toast.info("All signatures are already saved");
      return;
    }

    const loadingToastId = toast.loading(`Saving ${unsavedSignatures.length} signature(s)...`);

    // 4. Save signatures and track results
    const saveResults = await Promise.all(
      unsavedSignatures.map(async (sig) => {
        try {
          const res = await axios.post(
            `${backendUrl}/api/signatures`,
            {
              fileId: currentDoc._id,
              x: sig.x,
              y: sig.y,
              page: sig.page,
              status: "Signed"
            },
            {
              withCredentials: true,
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            }
          );

          return {
            ...sig,
            locked: res.data.success,
            serverId: res.data.signature?._id || sig.id
          };
        } catch (error) {
          console.error("Signature save failed:", error);
          return { ...sig, locked: false }; // Keep unlocked if failed
        }
      })
    );

    // 5. Update state with locked signatures
    setSignatures(prev => 
      prev.map(sig => {
        const savedSig = saveResults.find(s => s.id === sig.id);
        return savedSig ? { ...sig, locked: true } : sig;
      })
    );

    // 6. Verify results
    const savedCount = saveResults.filter(sig => sig.locked).length;
    if (savedCount === unsavedSignatures.length) {
      toast.update(loadingToastId, {
        render: "All signatures saved and locked!",
        type: "success",
        isLoading: false,
        autoClose: 3000
      });
    } else {
      toast.update(loadingToastId, {
        render: `Saved ${savedCount}/${unsavedSignatures.length} signatures`,
        type: savedCount > 0 ? "warning" : "error",
        isLoading: false,
        autoClose: 4000
      });
    }

  } catch (error) {
    console.error("Signature save error:", error);
    toast.error("Failed to save signatures");
  }
};






const handleGenerateSignedPDF = async () => {
  try {
    // Validate if document is selected
    if (!selectedPdfUrl || !docs.length) {
      toast.error("Please select a document first");
      return;
    }

    // Show loading state
    const loadingToastId = toast.loading("Generating signed PDF...");

    // Find the current document
    const selectedFileName = selectedPdfUrl.split("/").pop();
    const currentDoc = docs.find(doc => doc.filePath?.includes(selectedFileName));

    // Validate document exists
    if (!currentDoc?._id) {
      toast.update(loadingToastId, {
        render: "Document not found",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
      return;
    }

    // Generate signed PDF from backend
    const response = await axios.post(
      `${backendUrl}/api/signatures/generate-signed-pdf`,
      { fileId: currentDoc._id },
      {
        responseType: 'blob', // Important for file downloads
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );

    // Create filename (using original name or fallback to 'document')
    const filename = `signed_${currentDoc.name || 'document'}.pdf`;

    // Use FileSaver.js for reliable download
    saveAs(
      new Blob([response.data], { type: 'application/pdf' }),
      filename
    );

    // Update success notification
    toast.update(loadingToastId, {
      render: "Signed PDF download started!",
      type: "success",
      isLoading: false,
      autoClose: 3000
    });

  } catch (error) {
    console.error("PDF Download Error:", error);
    
    // Show appropriate error message
    const errorMessage = error.response?.data?.message || 
      error.message || 
      "Failed to download signed PDF";

    toast.error(errorMessage, {
      autoClose: 5000
    });

    // If we have a loading toast, update it
    if (loadingToastId) {
      toast.update(loadingToastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    }
  }
};

const handleDeleteSignature = (id) => {
    setSignatures((prev) => prev.filter((sig) => sig.id !== id));
  };

  const handleMoveSignature = (id, newX, newY) => {
  setSignatures((prev) =>
    prev.map((sig) =>
      sig.id === id ? { ...sig, x: newX, y: newY } : sig
    )
  );
};


  if (loading) return <p>Loading your PDFs...</p>;

  return (
    <div className="px-4 py-8">
      <img src={assets.logo} alt="" className="w-60 pl-22 sm:w-55 z-40 [filter:drop-shadow(0_2px_4px_rgba(139,92,246,0.6))_drop-shadow(0_6px_12px_rgba(88,28,135,0.5))]  transition-transform duration-300 rounded-xl backdrop-blur-sm p-1" />
      {!showEditor && (
        <div className="flex flex-col items-center mt-24 px-4 text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4 pt-24">Edit Your PDF</h1>
          <p className="text-indigo-600 mb-8">Upload a PDF to edit and sign it with ease.</p>
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-4">
            <input type="file" name="pdf" accept="application/pdf" className="border px-6 py-4" />
            <button type="submit" className="bg-indigo-600 text-white px-6 py-4 rounded">
              Upload PDF
            </button>
          </form>
        </div>
      )}

      {showEditor && selectedPdfUrl && (
        <div className="flex flex-col md:flex-row gap-6 mt-12">

          <DndContext>
            <div
              className="flex-1 relative border p-4 bg-white rounded shadow pdf-container"
              style={{ maxHeight: "80vh", overflowY: "scroll", position: "relative" }} // <-- added position
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                const type = e.dataTransfer.getData("text/plain");
                if (type === "signature") {
                  const boundingBox = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - boundingBox.left;
                  const y = e.clientY - boundingBox.top;

                  setSignatures((prev) => [
                    ...prev,
                    {
                      id: Date.now(),
                      x,
                      y,
                      name: signatureName,
                      page: currentPage,
                      locked: false,
                    },
                  ]);
                }
              }}
            >
              <Document
                key={selectedPdfUrl}
                file={selectedPdfUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p>Loading PDF...</p>}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    key={index + 1}
                    pageNumber={index + 1}
                    width={500}
                    onClick={() => setCurrentPage(index + 1)}
                  />
                ))}
              </Document>

              {signatures.map(
                (sig) =>
                  sig.page === currentPage && (
                    <SignaturePlaceholder
                      key={sig.id}
                      id={sig.id}
                      x={sig.x}
                      y={sig.y}
                      name={sig.name}
                      onDelete={handleDeleteSignature}
                      onMove={handleMoveSignature}
                      locked={sig.locked}
                    />
                  )
              )}
            </div>
          </DndContext>




          <div className="w-full md:w-1/3 p-4 bg-white rounded shadow border">
            <h2 className="text-lg font-semibold mb-4 text-indigo-800">PDF Editor Tools</h2>
            <label className="block mb-2 font-medium">Your Name for Signature:</label>

              <div
                id="draggable-signature"
                style={{
                  padding: "10px",
                  border: "1px dashed #aaa",
                  cursor: "grab",
                  backgroundColor: "#f0f0f0",
                  textAlign: "center",
                  marginBottom: "12px",
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", "signature");
                }}
              >
                Drag Signature
              </div>


            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Enter name"
              className="w-full border px-4 py-2 mb-4 rounded"
            />
            

            <p className="text-sm text-gray-500 mb-2">Click on PDF to place your signature</p>
            <button
              onClick={handleSaveSignature}
              className="bg-green-600 text-white px-4 py-2 rounded w-full mb-2"
            >
              Save Signatures
            </button>
            <button
              onClick={handleGenerateSignedPDF}
              className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
            >
              Download Signed PDF
            </button>
            <button
              onClick={() => {
                setShowEditor(false);
                setSelectedPdfUrl(null);
                setSignatures([]);
              }}
              className="mt-4 text-sm text-indigo-600 hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocDashboard;
