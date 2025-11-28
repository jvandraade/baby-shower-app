// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { GiftList } from '../features/gifts/GiftList';
import { ConfirmedList } from '../components/ConfirmedList';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useGifts } from '../features/gifts/useGifts';
import { supabase } from '../utils/storage'; // ← importa o cliente
import { Toaster, toast } from 'react-hot-toast';

export const Home = () => {
  const [name, setName] = useState('');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);

  const { confirmGift, confirmedGuests, loading } = useGifts();

  const handleConfirm = async () => {
    if (!name.trim()) return toast.error('Digite o nome');
    if (!selectedGiftId) return toast.error('Escolha um presente');

    const ok = await confirmGift(name.trim(), selectedGiftId);
    if (ok) {
      setName('');
      setSelectedGiftId(null);
    }
  };

  // RESET INFALÍVEL (usa DELETE com condição sempre verdadeira)
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (prompt('Senha para ZERAR tudo:') !== 'jonathan2026') {
          toast.error('Senha errada');
          return;
        }

        const { error } = await supabase.from('confirmed_gifts').delete().not('id', 'is', null); // deleta tudo que tem id

        if (error) {
          toast.error('Erro ao resetar');
          console.error(error);
        } else {
          toast.success('Zerado! Atualizando...');
          setTimeout(() => location.reload(), 1500);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-army-green">
        Carregando presentes...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gradient-to-b from-baby-blue/10 to-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <h2 className="text-4xl font-bold text-army-green mb-8">
              Confirme sua presença e escolha o presente
            </h2>

            <div className="max-w-2xl mx-auto space-y-8">
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome ou do casal"
              />

              <GiftList selectedGiftId={selectedGiftId} onSelectGift={setSelectedGiftId} />

              <Button
                onClick={handleConfirm}
                disabled={!name.trim() || !selectedGiftId}
                className="w-full py-5 text-xl"
              >
                Confirmar Presença e Presente
              </Button>
            </div>
          </section>

          <ConfirmedList guests={confirmedGuests} />
        </main>

        {/* Rodapé com carinho */}
        <footer className="text-center py-8 text-gray-600 text-sm">
          Feito com muito amor por Vitor • Chá do Jonathan 2026
        </footer>
      </div>
    </>
  );
};

export default Home;
