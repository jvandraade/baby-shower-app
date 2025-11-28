import type { ConfirmedGuest } from '../features/gifts/types'; // Importe para tipar

const STORAGE_KEY = 'baby-shower-jonathan-2025';

export interface StoredData {
  selectedGiftIds: string[];
  confirmedGuests: ConfirmedGuest[];
}

export const loadData = (): StoredData => {
  if (typeof window === 'undefined') return { selectedGiftIds: [], confirmedGuests: [] };

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { selectedGiftIds: [], confirmedGuests: [] };

  try {
    const parsed = JSON.parse(data);
    return {
      selectedGiftIds: parsed.selectedGiftIds || [],
      confirmedGuests: (parsed.confirmedGuests || []).map((g: ConfirmedGuest) => ({
        ...g,
        confirmedAt: new Date(g.confirmedAt), // Converta string de volta para Date
      })),
    };
  } catch (error) {
    console.error('Erro ao parsear localStorage:', error);
    return { selectedGiftIds: [], confirmedGuests: [] }; // Fallback se der erro
  }
};

export const saveData = (data: StoredData) => {
  // Antes de salvar, converta Date para ISO string (já que JSON.stringify faz isso auto)
  const toSave = {
    selectedGiftIds: data.selectedGiftIds,
    confirmedGuests: data.confirmedGuests.map(g => ({
      ...g,
      confirmedAt: g.confirmedAt.toISOString(), // Garanta string ISO
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
};
