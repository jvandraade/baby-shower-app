import type { ConfirmedGuest } from '../features/gifts/types';
import { useGifts } from '../features/gifts/useGifts';
import { FaHeart, FaBaby } from 'react-icons/fa';

interface Props {
  guests: ConfirmedGuest[];
}

export const ConfirmedList = ({ guests }: Props) => {
  const { getGiftById } = useGifts();

  if (guests.length === 0) {
    return null;
  }

  return (
    <section className="mt-20 px-4">
      <h2 className="text-4xl font-bold text-center text-army-green mb-10 flex items-center justify-center gap-4">
        <FaBaby className="text-baby-blue" />
        Pessoas Confirmadas
        <FaHeart className="text-light-green animate-pulse" />
      </h2>

      <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
        {guests.map(guest => {
          const gift = getGiftById(guest.giftId);
          return (
            <div
              key={guest.id}
              className="bg-white rounded-2xl p-6 shadow-lg border-l-8 border-light-green flex items-center gap-5"
            >
              <div className="text-4xl text-baby-blue">
                <FaHeart />
              </div>
              <div>
                <p className="font-bold text-xl text-army-green">{guest.name}</p>
                <p className="text-gray-700">
                  vai levar:{' '}
                  <span className="font-medium">{gift?.name || 'Presente surpresa'}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-10 text-2xl font-bold text-army-green">
        {guests.length} {guests.length === 1 ? 'pessoa confirmada' : 'pessoas confirmadas'} até
        agora!
      </p>
    </section>
  );
};
