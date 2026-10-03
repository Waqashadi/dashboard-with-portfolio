import { signOut } from "next-auth/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Logout = ({ className } : { className?: string }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleConfirmLogout = async () => {
    await signOut({ redirect: false });
    setShowModal(false);
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <>
      {/* 1. The Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className={`buttoni  ${className}`}
      >
        Logout
      </button>

      {/* 2. The Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
            {/* Modal Content */}
            <div className="p-6 text-center">
              {/* Icon */}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-6 w-6 text-red-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-bold text-gray-900">Sign Out?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to end your session? You will need to
                login again to access your account.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="buttoni w-full !py-2"
              >
                Yes, Logout
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Logout;