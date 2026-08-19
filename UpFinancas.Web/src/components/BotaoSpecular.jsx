import { useRef, useState } from "react";

export default function BotaoSpecular({ rotulo, ativo, onClick }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Esta função descobre onde o seu mouse está dentro do botão
  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold outline-none transition-transform active:scale-95"
    >
      {/* 
        1. Borda Especular (Rim Light): Fica no fundo absoluto.
        Quando o mouse passa, a luz segue a posição exata.
      */}
      <div
        className="absolute inset-0 rounded-xl transition-all duration-300"
        style={{
          background: isHovered 
            ? `radial-gradient(50px circle at ${position.x}px ${position.y}px, ${ativo ? 'rgba(255,255,255,0.8)' : 'rgba(99,102,241,0.8)'}, transparent 100%)`
            : "transparent",
          backgroundColor: ativo ? "#4f46e5" : "#e2e8f0" // Cores base da borda (indigo-600 ou slate-200)
        }}
      />

      {/* 
        2. Corpo do Botão (Inner Surface):
        Ele fica 1px menor (inset-[1px]) do que a div de cima, escondendo o centro da luz
        e deixando apenas a borda iluminada visível!
      */}
      <div 
        className={`absolute inset-[1px] rounded-[11px] transition-colors duration-300 ${
          ativo ? 'bg-indigo-600' : 'bg-white'
        }`} 
      />

      {/* 
        3. Luz interna (Inner Glow) que também segue o mouse
      */}
      <div
        className={`absolute inset-[1px] rounded-[11px] pointer-events-none transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        style={{
          background: `radial-gradient(80px circle at ${position.x}px ${position.y}px, ${ativo ? 'rgba(255,255,255,0.25)' : 'rgba(99,102,241,0.1)'}, transparent 100%)`
        }}
      />

      {/* 4. Texto do botão */}
      <span className={`relative z-10 transition-colors duration-300 ${ativo ? "text-white" : "text-slate-500 group-hover:text-indigo-600"}`}>
        {rotulo}
      </span>
    </button>
  );
}