import type { Gift } from '../features/gifts/types';
import { FaGift } from 'react-icons/fa';
import * as AllIcons from 'react-icons/fa';

interface Props {
  gift: Gift;
  isTaken: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// Mapeamento seguro de ícones
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = AllIcons;

export const GiftItem = ({ gift, isTaken, isSelected, onSelect }: Props) => {
  const IconComponent = iconMap[gift.icon] || FaGift;

  return (
    <label
      className={`
        relative flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-300 select-none
        ${
          isTaken
            ? 'bg-gray-100 border-gray-300 opacity-50 filter grayscale cursor-not-allowed'
            : 'bg-white border-baby-blue/30 hover:border-baby-blue hover:shadow-xl hover:-translate-y-1 cursor-pointer'
        }
        ${isSelected && !isTaken ? 'ring-4 ring-light-green/50 border-light-green shadow-2xl' : ''}
      `}
    >
      <input
        type="radio"
        name="gift"
        value={gift.id}
        checked={isSelected}
        onChange={() => onSelect(gift.id)}
        disabled={isTaken}
        className="sr-only"
      />

      <div className={`text-5xl ${isTaken ? 'text-gray-400' : 'text-baby-blue'}`}>
        <IconComponent />
      </div>

      <div className="flex-1">
        <p
          className={`font-semibold text-lg ${isTaken ? 'text-gray-500 line-through' : 'text-gray-800'}`}
        >
          {gift.name}
        </p>
        {isTaken && (
          <p className="text-sm text-red-500 mt-1">Já foi escolhido por outro convidado</p>
        )}
      </div>

      {isTaken && <div className="absolute top-2 right-2 text-2xl text-red-500">Taken</div>}
    </label>
  );
};
