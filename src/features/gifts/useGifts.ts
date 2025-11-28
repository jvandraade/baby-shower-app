// src/features/gifts/useGifts.ts
import { useState, useEffect } from 'react';
import type { Gift, ConfirmedGuest } from './types';
import { loadData, saveData } from '../../utils/storage';
import toast from 'react-hot-toast';

export const initialGifts: Gift[] = [
  { id: '1', name: 'Fraldas Pampers RN (1 pacote)', icon: 'FaBaby' },
  { id: '2', name: 'Fraldas Pampers P (2 pacotes)', icon: 'FaBaby' },
  { id: '3', name: 'Fraldas Pampers M (2 pacotes)', icon: 'FaBaby' },
  { id: '4', name: 'Kit 5 bodies manga curta', icon: 'FaTshirt' },
  { id: '5', name: 'Kit 3 calças mijão', icon: 'FaSocks' },
  { id: '6', name: 'Banheira com trocador', icon: 'FaBath' },
  { id: '7', name: 'Carrinho de passeio', icon: 'FaBabyCarriage' },
  { id: '8', name: 'Bebê conforto 0-13kg', icon: 'FaCarSide' },
  { id: '9', name: 'Cadeira de alimentação', icon: 'FaChair' },
  { id: '10', name: 'Kit mamadeiras (3 unidades)', icon: 'FaWineBottle' },
  { id: '11', name: 'Babá eletrônica com câmera', icon: 'FaVideo' },
  { id: '12', name: 'Móbile musical para berço', icon: 'FaMusic' },
  { id: '13', name: 'Cobertor de microfibra', icon: 'FaBlanket' },
  { id: '14', name: 'Jogo de lençol para berço (3 peças)', icon: 'FaBed' },
  { id: '15', name: 'Mochila maternidade', icon: 'FaBackpack' },
  { id: '16', name: 'Kit higiene bebê', icon: 'FaCut' },
  { id: '17', name: 'Chupetas e mordedores', icon: 'FaCookieBite' },
  { id: '18', name: 'Toalhas de banho com capuz (2 unid.)', icon: 'FaShower' },
  { id: '19', name: 'Pomada para assaduras', icon: 'FaHandHoldingHeart' },
  { id: '20', name: 'Álcool 70% e algodão', icon: 'FaHandSparkles' },
];

export const useGifts = () => {
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [confirmedGuests, setConfirmedGuests] = useState<ConfirmedGuest[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carrega do localStorage apenas uma vez
  useEffect(() => {
    const data = loadData();

    const updateState = () => {
      setSelectedGiftIds(data.selectedGiftIds);
      setConfirmedGuests(data.confirmedGuests);
      setIsLoaded(true);
    };
    updateState();
  }, []);

  // Salva toda vez que mudar, mas só depois de carregar
  useEffect(() => {
    if (!isLoaded) return;
    saveData({ selectedGiftIds, confirmedGuests });
  }, [selectedGiftIds, confirmedGuests, isLoaded]);

  const confirmGift = (name: string, giftId: string): boolean => {
    if (selectedGiftIds.includes(giftId)) {
      toast.error('Este presente já foi escolhido! Escolha outro');
      return false;
    }

    const newGuest: ConfirmedGuest = {
      id: crypto.randomUUID?.() || Date.now().toString(),
      name: name.trim(),
      giftId,
      confirmedAt: new Date(),
    };

    setConfirmedGuests(prev => [...prev, newGuest]);
    setSelectedGiftIds(prev => [...prev, giftId]);

    toast.success(`Obrigado, ${name}! Presente confirmado`);
    return true;
  };

  const getGiftById = (id: string): Gift | undefined => initialGifts.find(g => g.id === id);

  const isGiftTaken = (giftId: string): boolean => selectedGiftIds.includes(giftId);

  return {
    gifts: initialGifts,
    confirmedGuests,
    confirmGift,
    getGiftById,
    isGiftTaken,
  };
};
