import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function BackButton({ to, label = "Back" }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/40 border border-white/40 text-slate-800 font-semibold transition-all hover:bg-white/60 hover:shadow-md hover:-translate-y-0.5 btn-primary"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

export default BackButton;