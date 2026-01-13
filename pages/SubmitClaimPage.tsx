import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadIcon, FileTextIcon, SpinnerIcon } from '../components/IconComponents';
import { CLAIM_CATEGORIES } from '../lib/mockData';
import Button from '../components/Button';

const SubmitClaimPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sessionStr = localStorage.getItem('nuture_user_session');
    const session = sessionStr ? JSON.parse(sessionStr) : {};
    
    if (!session.uid) {
        alert("Please sign in to submit a claim.");
        return;
    }

    setIsSubmitting(true);

    try {
        const response = await fetch('http://localhost:5000/api/submit-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                uid: session.uid,
                amount: amount,
                description: description,
                category: category,
                // Sending filenames as an array to the backend
                receipts: files.map(f => f.name) 
            }),
        });

        if (response.ok) {
            alert("Claim submitted successfully with attachments!");
            navigate("/claims");
        } else {
            const err = await response.json();
            alert("Error: " + err.error);
        }
    } catch (error) {
        alert("Could not connect to the backend server. Please check if it's running.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Submit a Claim</h1>
            <p className="mt-2 text-gray-400">
              Provide your medical details and upload receipts for reimbursement.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Category Selection */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none"
              >
                <option value="" disabled>Select category</option>
                {CLAIM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">Claim Amount (₦)</label>
              <input 
                id="amount" 
                type="number" 
                placeholder="e.g. 5000" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none" 
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea 
                id="description" 
                placeholder="Describe the medical service or reason for this claim..." 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                rows={4} 
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green outline-none" 
              />
            </div>

            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload Receipts/Prescriptions</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-brand-green transition-colors">
                <input
                  id="files"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="files" className="cursor-pointer">
                  <UploadIcon className="w-12 h-12 mx-auto mb-2 text-gray-500" />
                  <p className="text-sm text-gray-400 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">PNG, JPG or PDF</p>
                </label>
              </div>

              {/* Attached Files List */}
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Attached Files:</p>
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm bg-brand-green/10 border border-brand-green/20 p-2 rounded-md">
                      <FileTextIcon className="w-4 h-4 text-brand-green flex-shrink-0" />
                      <span className="text-gray-300 truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" className="w-full flex justify-center items-center" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Claim"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitClaimPage;