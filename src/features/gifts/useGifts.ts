import { useState, useEffect } from 'react';
import type { Gift, ConfirmedGuest } from './types';
import { supabase } from '../../utils/storage';
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
  { id: '21', name: 'Brinquedos sensoriais 0-6m', icon: 'FaPuzzlePiece' },
  { id: '22', name: 'Livros de pano ou banho', icon: 'FaBookOpen' },
];

type DBGuest = {
  id: string;
  guest_name: string;
  gift_id: string;
  created_at: string;
};

export const useGifts = () => {
  const [selectedGiftIds, setSelectedGiftIds] = useState<string[]>([]);
  const [confirmedGuests, setConfirmedGuests] = useState<ConfirmedGuest[]>([]);
  const [loading, setLoading] = useState(true);

  // CARREGA DO SUPABASE
  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('confirmed_gifts')
        .select('id, guest_name, gift_id, created_at')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Erro ao carregar:', error);
        toast.error('Erro de conexão. Tente atualizar a página.');
        setLoading(false);
        return;
      }

      const guests = (data as DBGuest[]) || [];
      setConfirmedGuests(
        guests.map(g => ({
          id: g.id,
          name: g.guest_name,
          giftId: g.gift_id,
          confirmedAt: new Date(g.created_at),
        }))
      );
      setSelectedGiftIds(guests.map(g => g.gift_id));
      setLoading(false);
    };
    fetch();
  }, []);

  // CONFIRMA PRESENTE NO SUPABASE
  const confirmGift = async (name: string, giftId: string): Promise<boolean> => {
    if (selectedGiftIds.includes(giftId)) {
      toast.error('Este presente já foi escolhido por outra pessoa!');
      return false;
    }

    try {
      // ESSA É A ORDEM CORRETA: insert → select → single
      const { data, error } = await supabase
        .from('confirmed_gifts')
        .insert({
          guest_name: name.trim(),
          gift_id: giftId,
        })
        .select('id, guest_name, gift_id, created_at')
        .single();

      if (error) {
        console.error('Erro do Supabase:', error);
        toast.error('Erro ao salvar. Tente novamente em 5 segundos.');
        return false;
      }

      // Atualiza estado local com os dados reais do banco
      const newGuest: ConfirmedGuest = {
        id: data.id,
        name: data.guest_name,
        giftId: data.gift_id,
        confirmedAt: new Date(data.created_at),
      };

      setConfirmedGuests(prev => [...prev, newGuest]);
      setSelectedGiftIds(prev => [...prev, giftId]);

      toast.success(`Perfeito, ${name}! Seu presente foi confirmado`);
      return true;
    } catch (err) {
      console.error('Erro inesperado:', err);
      toast.error('Falha ao conectar. Verifique sua internet.');
      return false;
    }
  };

  const getGiftById = (id: string): Gift | undefined => initialGifts.find(g => g.id === id);

  const isGiftTaken = (giftId: string): boolean => selectedGiftIds.includes(giftId);

  return {
    gifts: initialGifts,
    confirmedGuests,
    loading,
    confirmGift,
    getGiftById,
    isGiftTaken,
  };
};
