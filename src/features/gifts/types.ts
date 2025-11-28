export interface Gift {
  id: string;
  name: string;
  description?: string;
  icon: string;
}

export interface ConfirmedGuest {
  id: string;
  name: string;
  giftId: string;
  confirmedAt: Date;
}
