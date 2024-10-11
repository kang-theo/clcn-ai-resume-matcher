import React, { useRef, useCallback, useState } from 'react';
import { Icons } from "@/components/common/Icons";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  provider: 'github' | 'google';
  isSigning: boolean;
  setIsSigning: React.Dispatch<React.SetStateAction<boolean>>;
  signInAction: (formData: FormData) => Promise<void>;
}

const SignInButton: React.FC<SignInButtonProps> = ({
  provider,
  isSigning,
  setIsSigning,
  signInAction,
}) => {
  const formSSORef = useRef<HTMLFormElement>(null);

  const handleSignIn = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setIsSigning(true);

      if (formSSORef.current) {
        const formData = new FormData(formSSORef.current);
        await signInAction(formData);
      } else {
        console.error('Form element is not available.');
      }

      setIsSigning(false);
    },
    [setIsSigning, signInAction]
  );

  return (
    <form ref={formSSORef} onSubmit={handleSignIn}>
      <Button
        className='w-full mb-4'
        variant='outline'
        disabled={isSigning}
        onClick={handleSignIn}
      >
        {isSigning ? (
          <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
        ) : provider === 'github' ? (
          <Icons.GitHub className='mr-2 h-4 w-4' />
        ) : (
          <Icons.Google className='mr-2 h-4 w-4' />
        )}
        {provider.charAt(0).toUpperCase() + provider.slice(1)}
      </Button>
    </form>
  );
};

export default SignInButton;
