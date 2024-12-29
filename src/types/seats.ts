export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip' | 'imax' | 'couple';
}

export interface SeatTypeInfo {
  title: string;
  description: string;
  benefits: string[];
  color: string;
  priceMultiplier: number;
}

export const SEAT_TYPES: Record<Seat['type'], SeatTypeInfo> = {
  standard: {
    title: 'Standard',
    description: 'Assento tradicional com todo o conforto necessário',
    benefits: ['Assento reclinável', 'Suporte para copos'],
    color: '#fff',
    priceMultiplier: 1
  },
  vip: {
    title: 'VIP',
    description: 'Experiência premium com mais espaço e conforto',
    benefits: [
      'Assento mais largo',
      'Apoio para pernas',
      'Serviço de comidas e bebidas'
    ],
    color: '#FFD700',
    priceMultiplier: 1.5
  },
  imax: {
    title: 'IMAX',
    description: 'A melhor experiência audiovisual do cinema',
    benefits: [
      'Tela gigante IMAX',
      'Som imersivo',
      'Ângulo perfeito de visão'
    ],
    color: '#00FF00',
    priceMultiplier: 2
  },
  couple: {
    title: 'Casal',
    description: 'Assentos especiais para momentos românticos',
    benefits: [
      'Assento duplo sem divisória',
      'Maior privacidade',
      'Localização especial'
    ],
    color: '#FF69B4',
    priceMultiplier: 2.5
  }
};

export const ROOM_FEATURES = {
  comfort: {
    icon: 'seat-recline-extra',
    title: 'Conforto Premium',
    items: [
      'Poltronas reclináveis 180°',
      'Apoio de pernas elétrico',
      'Espaço extra entre fileiras'
    ]
  },
  sound: {
    icon: 'surround-sound',
    title: 'Som Imersivo',
    items: [
      'Dolby Atmos 3D',
      '64 canais de áudio',
      'Subwoofers dedicados'
    ]
  },
  screen: {
    icon: 'television',
    title: 'Projeção IMAX',
    items: [
      'Resolução 4K HDR',
      'Tela curva de 26m',
      'Brilho de 14fL'
    ]
  },
  extras: {
    icon: 'star',
    title: 'Diferenciais',
    items: [
      'Ar condicionado individual',
      'Serviço de snacks',
      'Carregadores USB'
    ]
  }
};

export const SEAT_INFO_SECTIONS = {
  screen: {
    title: 'TELA IMAX',
    subtitle: 'Projeção Digital 4K HDR',
    specs: ['Som Dolby Atmos', '26m x 14m', 'Tela Curva']
  },
  room: {
    title: 'SALA VIP 3',
    subtitle: 'Capacidade: 160 lugares',
    features: ['Ar Condicionado', 'Som Imersivo', 'Poltronas Reclináveis']
  }
};

export const DISCOUNTS = {
  quantity: {
    6: { value: 0.15, label: 'Super Combo: 15% na compra de 6 ou mais ingressos' },
    4: { value: 0.10, label: 'Combo Amigos: 10% na compra de 4-5 ingressos' },
    2: { value: 0.05, label: 'Combo Duplo: 5% na compra de 2-3 ingressos' },
  },
  package: {
    vipCouple: { 
      value: 0.20, 
      label: 'Combo Romântico VIP: 20% de desconto nos assentos VIP + Casal' 
    },
    imaxVip: { 
      value: 0.15, 
      label: 'Combo Premium: 15% de desconto nos assentos IMAX + VIP' 
    },
  },
  weekday: {
    monday: { value: 0.25, label: 'Super Segunda: 25% em todos os assentos' },
    tuesday: { value: 0.25, label: 'Terça Imperdível: 25% em todos os assentos' },
    wednesday: { value: 0.15, label: 'Quarta Promo: 15% em todos os assentos' },
  }
};

export const WEEKDAYS = {
  0: { id: 'sunday', label: 'Domingo' },
  1: { id: 'monday', label: 'Segunda-feira' },
  2: { id: 'tuesday', label: 'Terça-feira' },
  3: { id: 'wednesday', label: 'Quarta-feira' },
  4: { id: 'thursday', label: 'Quinta-feira' },
  5: { id: 'friday', label: 'Sexta-feira' },
  6: { id: 'saturday', label: 'Sábado' }
} as const; 