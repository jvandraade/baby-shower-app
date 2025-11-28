import { motion } from 'framer-motion';
import { FaHeart, FaBaby, FaCalendarAlt } from 'react-icons/fa';

export const Header = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-b from-baby-blue/30 via-white to-white pt-10 pb-20">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden border-8 border-white shadow-2xl">
            <img
              src="/casal.jpg"
              alt="Juan e Júlia esperando o Jonathan"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-center items-center gap-6 mb-6 text-6xl">
            <FaBaby className="text-baby-blue animate-bounce" />
            <FaHeart className="text-army-green animate-pulse" />
            <FaBaby className="text-baby-blue animate-bounce" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-army-green mb-4">
            Chá de Bebê do Jonathan
          </h1>

          <p className="text-2xl md:text-3xl text-gray-700 font-medium mb-6">Juan & Júlia</p>

          <div className="flex items-center justify-center gap-3 text-xl text-army-green">
            <FaCalendarAlt />
            <span>Sábado, 14 de Fevereiro de 2026 • 15h</span>
          </div>

          <p className="mt-10 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Estamos contando os dias para a chegada do nosso maior presente! Sua presença já é o
            melhor parte, mas se quiser nos ajudar a preparar a chegada do Jonathan, escolha um
            presentinho da lista abaixo
          </p>
        </motion.div>
      </div>
    </header>
  );
};
