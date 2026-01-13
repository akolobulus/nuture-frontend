import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, SpinnerIcon } from "../components/IconComponents";
import Button from "../components/Button";

export default function TransferPolicyPage() {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipientEmail) {
      alert("Please provide the recipient's email.");
      return;
    }

    setIsLoading(true);

    // Simulate API call and logic
    setTimeout(() => {
      try {
        // In a real app, you'd call a backend here.
        // For the demo, we just clear the local subscription.
        localStorage.removeItem('nuture_subscription');

        alert("Transfer Successful! Your policy has been transferred.");
        navigate("/dashboard");

      } catch (error) {
        console.error("Transfer error:", error);
        alert("Transfer Failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  return (
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-green to-emerald-400 bg-clip-text text-transparent">
              Transfer Your Policy
            </h1>
            <p className="text-gray-400">
              Safely transfer your unused coverage to another NUTM student.
            </p>
          </div>

          <div className="bg-gray-800 border border-brand-green/20 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white">Transfer Details</h2>
              <p className="text-gray-400 mt-1 mb-6">
                Transfer your active subscription to a fellow student. The new recipient must be a verified NUTM student.
              </p>
              <form onSubmit={handleTransfer} className="space-y-6">
                
                <div className="space-y-2">
                  <label htmlFor="newUserEmail" className="block text-sm font-medium text-gray-300 mb-2">Recipient's NUTM Email</label>
                  <input
                    id="newUserEmail"
                    type="email"
                    placeholder="recipient@nutm.edu.ng"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-brand-green focus:border-brand-green"
                  />
                  <p className="text-xs text-gray-500">
                    Must be a verified NUTM student email.
                  </p>
                </div>

                <div className="bg-brand-green/5 border border-brand-green/20 rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-brand-green">Important Notes:</h3>
                  <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    <li>The transfer is permanent and cannot be reversed.</li>
                    <li>The recipient cannot have an existing active subscription.</li>
                    <li>All remaining coverage will be transferred.</li>
                    <li>You will lose access to this policy immediately upon transfer.</li>
                  </ul>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                      <>
                        <SpinnerIcon className="mr-2 h-4 w-4" />
                        Processing...
                      </>
                  ) : (
                      <>
                        Transfer Policy
                        <ArrowRightIcon className="ml-2 w-4 h-4" />
                      </>
                  )}
                </Button>
              </form>
          </div>

          <div className="mt-8 text-center">
            <Button variant="secondary" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
  );
}