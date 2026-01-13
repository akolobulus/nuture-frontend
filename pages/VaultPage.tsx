import React, { useState, useEffect } from 'react';
import { 
    VaultIcon, UploadIcon, LockClosedIcon, LockOpenIcon, 
    ShareIcon, FileTextIcon, UserPlusIcon 
} from '../components/IconComponents';
import Button from '../components/Button';
import { VaultDocument, NextOfKin } from '../types';

// Fix for 'Property env does not exist on type ImportMeta'
const API_URL = (import.meta as any).env.VITE_API_URL;

const VaultPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'records' | 'emergency'>('records');
    const [documents, setDocuments] = useState<VaultDocument[]>([]);
    const [kins, setKins] = useState<NextOfKin[]>([]);
    const [newKinEmail, setNewKinEmail] = useState('');
    const [uploading, setUploading] = useState(false);

    const session = JSON.parse(localStorage.getItem('nuture_user_session') || '{}');

    useEffect(() => {
        const fetchVaultData = async () => {
            if (!session.uid) return;
            try {
                // Fixed: Using dynamic API_URL for Render
                const res = await fetch(`${API_URL}/api/vault/get/${session.uid}`);
                if (res.ok) {
                    const data = await res.json();
                    setDocuments(data);
                }
                
                const storedKins = localStorage.getItem('nuture_vault_kins');
                if (storedKins) setKins(JSON.parse(storedKins));
            } catch (err) { 
                console.error("Vault fetch failed", err); 
            }
        };
        fetchVaultData();
    }, [session.uid]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const file = e.target.files[0];

            try {
                // Fixed: Using dynamic API_URL for Render
                const response = await fetch(`${API_URL}/api/vault/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        uid: session.uid,
                        name: file.name,
                        type: file.type.split('/')[1] || 'unknown',
                        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
                    }),
                });

                if (response.ok) {
                    const newDoc = await response.json();
                    setDocuments([newDoc, ...documents]);
                }
            } catch (err) { 
                alert("Blockchain anchoring failed. Check your connection."); 
            } finally { 
                setUploading(false); 
            }
        }
    };

    const handleAddKin = (e: React.FormEvent) => {
        e.preventDefault();
        if (kins.length >= 5) { alert("Max 5 Next of Kin."); return; }
        if (!newKinEmail) return;
        
        const newKin: NextOfKin = { 
            id: `kin_${Date.now()}`, 
            name: newKinEmail.split('@')[0], 
            email: newKinEmail, 
            hasRequestedAccess: false 
        };
        const updatedKins = [...kins, newKin];
        setKins(updatedKins);
        localStorage.setItem('nuture_vault_kins', JSON.stringify(updatedKins));
        setNewKinEmail('');
    };

    const handleShareDoc = (doc: any) => {
        // Updated: Using Vercel URL for share links
        navigator.clipboard.writeText(`https://nuture-final.vercel.app/#/vault/share/${doc.cid}`);
        alert(`Encrypted share link generated for ${doc.name}!`);
    };

    const toggleAccessRequest = (kinId: string) => {
        const updatedKins = kins.map(k => k.id === kinId ? { ...k, hasRequestedAccess: !k.hasRequestedAccess } : k);
        setKins(updatedKins);
        localStorage.setItem('nuture_vault_kins', JSON.stringify(updatedKins));
    };

    const accessApprovals = kins.filter(k => k.hasRequestedAccess).length;
    const isEmergencyUnlocked = accessApprovals >= 3;

    return (
        <div className="py-12 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <VaultIcon className="h-10 w-10 text-brand-green" />
                        Health Vault
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Secure, blockchain-anchored storage for medical records.
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-1 rounded-lg inline-flex border border-gray-200 dark:border-gray-700">
                    <button onClick={() => setActiveTab('records')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'records' ? 'bg-brand-green text-white' : 'text-gray-500'}`}>My Records</button>
                    <button onClick={() => setActiveTab('emergency')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'emergency' ? 'bg-red-600 text-white' : 'text-gray-500'}`}>Emergency Access</button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 min-h-[500px]">
                {activeTab === 'records' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Stored Documents</h2>
                            <label className="cursor-pointer bg-brand-green hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
                                <UploadIcon className="w-4 h-4" />
                                {uploading ? 'Anchoring...' : 'Secure New Record'}
                                <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                            </label>
                        </div>

                        {documents.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documents.map((doc: any) => (
                                    <div key={doc.id} className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-brand-green transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <FileTextIcon className="w-8 h-8 text-brand-green" />
                                            <button onClick={() => handleShareDoc(doc)} className="p-2 text-gray-400 hover:text-brand-green">
                                                <ShareIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">{doc.name}</h3>
                                        <p className="text-[10px] font-mono text-gray-500 mt-1 truncate">CID: {doc.cid}</p>
                                        <div className="flex justify-between items-center mt-4 text-xs">
                                            <span className="text-gray-500">{doc.size}</span>
                                            <span className="flex items-center gap-1 text-green-500"><LockClosedIcon className="w-3 h-3" /> Encrypted</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-gray-500">
                                Your Vault is empty. Upload medical records to secure them on the blockchain.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'emergency' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className={`p-6 rounded-xl border-2 ${isEmergencyUnlocked ? 'border-red-500 bg-red-500/5' : 'border-brand-green/30 bg-gray-50 dark:bg-gray-900'}`}>
                                <h3 className={`font-bold flex items-center gap-2 mb-2 ${isEmergencyUnlocked ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                                    {isEmergencyUnlocked ? <LockOpenIcon className="text-red-500 animate-pulse" /> : <LockClosedIcon className="text-brand-green" />}
                                    Vault Status: {isEmergencyUnlocked ? 'UNLOCKED' : 'SECURE'}
                                </h3>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                                    <div className={`h-2 rounded-full transition-all duration-700 ${isEmergencyUnlocked ? 'bg-red-500' : 'bg-brand-green'}`} style={{ width: `${(accessApprovals / 3) * 100}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-500">3/5 verified approvals required to release emergency keys.</p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-gray-500 uppercase">Trusted Contacts (Next of Kin)</h3>
                                {kins.map((kin) => (
                                    <div key={kin.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold">
                                                {kin.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-medium">{kin.name}</p>
                                                <p className="text-xs text-gray-500">{kin.email}</p>
                                            </div>
                                        </div>
                                        <div className={`text-xs font-bold ${kin.hasRequestedAccess ? 'text-red-500' : 'text-gray-500'}`}>
                                            {kin.hasRequestedAccess ? 'ACCESS REQUESTED' : 'IDLE'}
                                        </div>
                                    </div>
                                ))}
                                <form onSubmit={handleAddKin} className="flex gap-2">
                                    <input 
                                        type="email" 
                                        placeholder="Add kin email..." 
                                        value={newKinEmail} 
                                        onChange={(e) => setNewKinEmail(e.target.value)}
                                        className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-green"
                                    />
                                    <Button type="submit" className="!px-4"><UserPlusIcon className="w-5 h-5" /></Button>
                                </form>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-700 h-fit">
                            <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Emergency Simulator</h3>
                            <p className="text-[10px] text-gray-500 mb-4 italic">Simulate kin members providing their decryption keys during a medical emergency.</p>
                            <div className="space-y-2">
                                {kins.map(kin => (
                                    <button 
                                        key={kin.id} 
                                        onClick={() => toggleAccessRequest(kin.id)} 
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border transition-all ${kin.hasRequestedAccess ? 'bg-red-500 text-white border-red-400' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 border-gray-300 dark:border-gray-700'}`}
                                    >
                                        {kin.hasRequestedAccess ? 'Revoke Approval' : `Authorize for ${kin.name}`}
                                    </button>
                                ))}
                                {kins.length === 0 && <p className="text-[10px] text-center text-gray-600">Add trusted contacts to start simulation.</p>}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VaultPage;