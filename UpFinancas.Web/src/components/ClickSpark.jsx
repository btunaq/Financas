import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Componente que desenha UMA única faísca (explosão)
const Spark = ({ x, y, color, onComplete }) => {
  useEffect(() => {
    // A faísca dura 400ms, depois nós a deletamos para não pesar a memória
    const timer = setTimeout(onComplete, 400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{ position: 'fixed', left: x, top: y, zIndex: 999999, pointerEvents: 'none' }}>
      {/* Desenha 8 linhas apontando para fora */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45) * (Math.PI / 180); // 45 graus de diferença entre cada linha
        const distance = 35; // Distância que a faísca viaja
        
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scaleX: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scaleX: [0, 1, 0], // Estica e depois encolhe
              opacity: [1, 1, 0] // Fica invisível no final
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              position: 'absolute',
              width: '10px',
              height: '2px',
              backgroundColor: color,
              borderRadius: '2px',
              transformOrigin: 'left center',
              rotate: `${i * 45}deg`,
              marginTop: '-1px', // Centraliza na ponta do mouse
              marginLeft: '6px'  // Deixa um círculo vazio no meio do clique
            }}
          />
        );
      })}
    </div>
  );
};

// Gerenciador Global que escuta a tela inteira
export default function ClickSpark({ color = '#4f46e5' }) {
  const [sparks, setSparks] = useState([]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      // Adiciona um novo clique na lista de faíscas
      const newSpark = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setSparks((prev) => [...prev, newSpark]);
    };

    // Escuta cliques no site todo
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  return (
    <AnimatePresence>
      {sparks.map((spark) => (
        <Spark
          key={spark.id}
          x={spark.x}
          y={spark.y}
          color={color} // A cor da faísca (Por padrão, o roxo do Tailwind)
          onComplete={() => {
            setSparks((prev) => prev.filter((s) => s.id !== spark.id));
          }}
        />
      ))}
    </AnimatePresence>
  );
}