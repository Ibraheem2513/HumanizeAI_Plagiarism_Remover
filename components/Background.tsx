import React from 'react';

export const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-[#0f172a]">
      {/* Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/30 blur-[100px] mix-blend-screen animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-600/30 blur-[100px] mix-blend-screen animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-pink-600/30 blur-[100px] mix-blend-screen animate-blob animation-delay-4000" />
      
      {/* Noise Texture Overlay for texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
    </div>
  );
};
