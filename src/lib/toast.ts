// import { Toaster } from 'react-hot-toast';
// Add <Toaster /> in layout first

import toast from "react-hot-toast";

function success(message: string, options: Record<string, any>) {
  toast.success(message, { ...options, position: "top-right" });
}

function error(message: string, options: Record<string, any>) {
  toast.error(message, { ...options, position: "top-right" });
}

export const toaster = {
  success,
  error,
};
