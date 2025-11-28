import { GiftItem } from '../../components/GiftItem';
import { useGifts } from './useGifts';

interface Props {
  selectedGiftId: string | null;
  onSelectGift: (id: string) => void;
}

export const GiftList = ({ selectedGiftId, onSelectGift }: Props) => {
  const { gifts, isGiftTaken } = useGifts();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-4">
      {gifts.map(gift => (
        <GiftItem
          key={gift.id}
          gift={gift}
          isTaken={isGiftTaken(gift.id)}
          isSelected={selectedGiftId === gift.id}
          onSelect={onSelectGift}
        />
      ))}
    </div>
  );
};
