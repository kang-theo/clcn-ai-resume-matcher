import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
}

export function LoadingOverlay({
  message = "Loading...",
  submessage,
}: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className='absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center'
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className='flex flex-col items-center gap-2 bg-background/80 p-6 rounded-lg shadow-lg'
      >
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
        <p className='text-base font-medium'>{message}</p>
        {submessage && (
          <p className='text-sm text-muted-foreground'>{submessage}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
