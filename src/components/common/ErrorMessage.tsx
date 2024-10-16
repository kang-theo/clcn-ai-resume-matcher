import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface ErrorMessageProps {
  error?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="flex items-center mb-2 text-red-400">
      <InformationCircleIcon className="h-4 w-4 mr-1" />
      <p className='text-red-400 text-sm'>{error}</p>
    </div>
  );
};

export default ErrorMessage;
