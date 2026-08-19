import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LayoutDashboard, CreditCard, Home, Landmark } from "lucide-react";

// Os itens do seu menu
const MENU_ITEMS = [
  { id: 'dashboard', rotulo: 'Dashboard', icone: LayoutDashboard },
  { id: 'cartoes', rotulo: 'Cartões', icone: CreditCard },
  { id: 'gastos', rotulo: 'Gastos da Casa', icone: Home },
  { id: 'emprestimos', rotulo: 'Empréstimos', icone: Landmark },
];

function DockItem({ mouseX, icone: Icon, rotulo, onClick, ativo }) {
  const ref = useRef(null);

  // Calcula a distância do mouse para fazer o efeito de lupa (magnification)
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Transforma a distância em tamanho (Aumenta de 48px para 80px quando o mouse passa perto)
  const widthSync = useTransform(distance, [-150, 0, 150], [48, 80, 48]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <div className="relative group flex flex-col items-center">
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={onClick}
        className={`rounded-full flex items-center justify-center transition-colors duration-200 outline-none
          ${ativo 
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-300' 
            : 'bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 shadow-sm'
          }
        `}
      >
        {/* O ícone cresce junto com o botão */}
        <Icon className={`${ativo ? 'w-1/2 h-1/2' : 'w-5 h-5'}`} />
      </motion.button>
      
      {/* Tooltip flutuante que aparece no hover */}
      <span className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap shadow-md">
        {rotulo}
      </span>
    </div>
  );
}

export default function MenuDock({ abaAtiva, setAbaAtiva }) {
  // Guarda a posição do mouse na tela
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="flex h-20 items-end gap-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 px-4 pb-3 shadow-2xl ring-1 ring-slate-900/5"
      >
        {MENU_ITEMS.map((item) => (
          <DockItem
            key={item.id}
            mouseX={mouseX}
            rotulo={item.rotulo}
            icone={item.icone}
            ativo={abaAtiva === item.id}
            onClick={() => setAbaAtiva(item.id)}
          />
        ))}
      </div>
    </div>
  );
}