import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { GiftList } from '../features/gifts/GiftList';
import { ConfirmedList } from '../components/ConfirmedList';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useGifts } from '../features/gifts/useGifts';
import toast, { Toaster } from 'react-hot-toast';

declare module 'react-hot-toast' {
  interface ToasterProps {
    error: (message: string) => void;
  }
}
export const Home = () => {
  const [name, setName] = useState('');
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const { confirmGift, confirmedGuests } = useGifts();

  const handleConfirm = () => {
    if (!name.trim()) {
      toast.error('Por favor, digite seu nome ou do casal');
      return;
    }
    if (!selectedGiftId) {
      toast.error('Escolha um presente para levar');
      return;
    }

    const success = confirmGift(name.trim(), selectedGiftId);
    if (success) {
      setName('');
      setSelectedGiftId(null);
    }
  };

  // Tecla secreta para resetar tudo (senha: jonathan2025)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        const senha = prompt('Digite a senha para resetar a lista:');
        if (senha === 'jonathan2025') {
          localStorage.removeItem('baby-shower-jonathan-2025');
          window.location.reload();
          toast.success('Lista resetada com sucesso!');
        } else if (senha !== null) {
          toast.error('Senha incorreta!');
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ duration: 4000 }}
        error={message => console.error(message)}
      />

      <div className="min-h-screen bg-gradient-to-b from-baby-blue/10 to-white">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-12">
          <section className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-army-green mb-8">
              Confirme sua presença e escolha seu presente
            </h2>

            <div className="max-w-2xl mx-auto space-y-8">
              <div>
                <label className="block text-left text-lg font-medium text-gray-700 mb-3">
                  Nome do convidado ou casal
                </label>
                <Input
                  placeholder="Ex: Vitor ou Vitor e Maria"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>

              <div>
                <p className="text-left text-lg font-medium text-gray-700 mb-6">
                  Escolha 1 presente para levar
                </p>
                <GiftList selectedGiftId={selectedGiftId} onSelectGift={setSelectedGiftId} />
              </div>

              <Button
                onClick={handleConfirm}
                disabled={!name.trim() || !selectedGiftId}
                className="w-full text-xl py-6 shadow-xl"
              >
                Confirmar Presença e Presente
              </Button>
            </div>
          </section>

          <ConfirmedList guests={confirmedGuests} />
        </main>

        <footer className="text-center py-8 text-gray-600">Feito com muito amor por Vitor.</footer>
      </div>
    </>
  );
};
