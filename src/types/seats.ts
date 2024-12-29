export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'standard' | 'vip' | 'imax' | 'couple' | 'd-box';
}

export interface SeatTypeInfo {
  title: string;
  description: string;
  benefits: string[];
  color: string;
  priceMultiplier: number;
}

export const SEAT_TYPES: Record<Seat['type'], SeatTypeInfo> = {
  'd-box': {
    title: 'D-BOX',
    description: 'Experiência 4D com movimentos sincronizados ao filme',
    benefits: [
      'Movimentos sincronizados',
      'Vibração e efeitos táteis',
      'Sistema de áudio individual',
      'Controle de intensidade'
    ],
    color: '#FF4500', // Laranja vibrante
    priceMultiplier: 3
  },
  imax: {
    title: 'IMAX',
    description: 'A melhor experiência audiovisual com tela gigante',
    benefits: [
      'Tela IMAX de 26m',
      'Som Dolby Atmos 3D',
      'Resolução 4K HDR',
      'Ângulo perfeito de visão'
    ],
    color: '#00CED1', // Turquesa
    priceMultiplier: 2
  },
  vip: {
    title: 'VIP',
    description: 'Conforto premium com serviços exclusivos',
    benefits: [
      'Poltrona reclinável 180°',
      'Apoio elétrico para pernas',
      'Menu gastronômico exclusivo',
      'Atendimento personalizado'
    ],
    color: '#FFD700', // Dourado
    priceMultiplier: 1.75
  },
  couple: {
    title: 'LOVE SEAT',
    description: 'Assentos duplos especiais para casais',
    benefits: [
      'Assento duplo sem divisória',
      'Apoio de braço retrátil',
      'Maior privacidade',
      'Serviço de champagne'
    ],
    color: '#FF69B4', // Rosa
    priceMultiplier: 2.5
  },
  standard: {
    title: 'CLASSIC',
    description: 'Conforto tradicional com ótimo custo-benefício',
    benefits: [
      'Poltrona reclinável',
      'Porta-copos',
      'Encosto de braço',
      'Espaço adequado'
    ],
    color: '#4169E1', // Azul royal
    priceMultiplier: 1
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