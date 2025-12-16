import { useState, useEffect } from 'react';
import type { Gift, ConfirmedGuest } from './types';
import { supabase } from '../../utils/storage';
import toast from 'react-hot-toast';

export const initialGifts: Gift[] = [
  { id: '1', name: 'Fralda RN + Conjuntinho (M ou G)', icon: 'FaTshirt' },
  { id: '2', name: 'Fralda RN + Lenço umedecido e sabonete(barra)', icon: 'FaSoap' },
  { id: '3', name: 'Fralda RN + Colônia', icon: 'FaPumpSoap' },
  { id: '4', name: 'Fralda P + Kit Organizador (higiene)', icon: 'FaBoxOpen' },
  { id: '5', name: 'Fralda P + Meia e Luva', icon: 'FaSocks' },
  { id: '6', name: 'Fralda P + Termômetro', icon: 'FaThermometerHalf' },
  { id: '7', name: 'Fralda P + Jogo de berço', icon: 'FaBed' },
  { id: '8', name: 'Fralda P + Kit Mamadeiras', icon: 'FaWineBottle' },
  { id: '9', name: 'Fralda P + Kit alimentação', icon: 'FaUtensils' },
  { id: '10', name: 'Fralda P + Kit meias', icon: 'FaSocks' },
  { id: '11', name: 'Fralda P + Kit Cuidados e Higiene', icon: 'FaHandHoldingHeart' },
  { id: '12', name: 'Fralda M + travesseiro anatômico', icon: 'FaCloud' },
  { id: '13', name: 'Fralda M + Jogo de berço', icon: 'FaBed' },
  { id: '14', name: 'Fralda M + Kit calças (M/G)', icon: 'FaTshirt' },
  { id: '15', name: 'Fralda M + Shampoo e condicionador', icon: 'FaShower' },
  { id: '16', name: 'Fralda M + Loção hidratante', icon: 'FaTint' },
  { id: '17', name: 'Fralda M + Trocador', icon: 'FaBaby' },
  { id: '18', name: 'Fralda M + Algodão e cotonetes', icon: 'FaFeather' },
  { id: '19', name: 'Fralda M + Gaze e Álcool 70%', icon: 'FaFirstAid' },
  { id: '20', name: 'Fralda M + Colônia', icon: 'FaPumpSoap' },
  { id: '21', name: 'Fralda M + Pomada p/ Assaduras (Bepantol)', icon: 'FaHandHoldingHeart' },
  { id: '22', name: "Fralda M + Talco (Johnson's)", icon: 'FaSnowflake' },
  { id: '23', name: 'Fralda G + Tapete de atividades', icon: 'FaPuzzlePiece' },
  { id: '24', name: 'Fralda G + shampoo e condicionador', icon: 'FaShower' },
  { id: '25', name: 'Fralda G + Almofada para amamentação', icon: 'FaHeart' },
  { id: '26', name: 'Fralda G + Travesseiro para berço', icon: 'FaBed' },
  { id: '27', name: 'Fralda G + Óleo hidratante', icon: 'FaTint' },
  { id: '28', name: 'Fralda G + Kit c/ 5 fraldas de pano', icon: 'FaLayerGroup' },
  { id: '29', name: 'Fralda G + lenço umedecido e álcool 70%', icon: 'FaHandSparkles' },
  { id: '30', name: 'Fralda G + Kit camiseta (M/G)', icon: 'FaTshirt' },
  { id: '31', name: 'Fralda G + Copo anti-vazamento', icon: 'FaMugHot' },
  { id: '32', name: 'Fralda G + Mordedor com chocalho', icon: 'FaCookieBite' },
  { id: '33', name: 'Fralda G + Conjuntinho (M/G)', icon: 'FaTshirt' },
  { id: '34', name: 'Kit Cobertor com Naninha', icon: 'FaBed' },
  { id: '35', name: 'Kit cueiros + Brinquedo', icon: 'FaGamepad' },
  { id: '36', name: 'Kit de berço', icon: 'FaBed' },
  { id: '37', name: 'Babá eletrônica', icon: 'FaVideo' },
  { id: '38', name: 'Manta + Kit paninhos de boca', icon: 'FaFeather' },
  { id: '39', name: 'Banheira + chinelinho (tam 22)', icon: 'FaBath' },
  { id: '40', name: 'Toalha de banho com capuz + sabonete líquido', icon: 'FaBath' },
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
