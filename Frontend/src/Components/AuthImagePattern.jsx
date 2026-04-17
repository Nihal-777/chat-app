import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-base-200 p-12 relative overflow-hidden">
      <div className="w-full max-w-lg text-center flex flex-col justify-center items-center h-full z-10">
        <div className="w-full flex-1 flex justify-center items-center mb-8">
          <DotLottieReact
            src="/welcome-animation.lottie"
            loop
            autoplay
            className="w-full max-h-[60vh] object-contain drop-shadow-2xl"
          />
        </div>
        <div className="mt-auto">
          <h2 className="text-3xl font-bold mb-4">{title}</h2>
          <p className="text-base-content/60 text-lg">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;