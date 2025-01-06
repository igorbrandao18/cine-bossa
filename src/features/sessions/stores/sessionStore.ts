import { create } from 'zustand';

export type SessionType = 'imax' | '3d' | 'dbox' | 'vip' | 'standard';

export interface Seat {
  id: string;
  row: string;
  number: string;
  type: 'standard' | 'couple' | 'premium' | 'wheelchair';
  status: 'available' | 'occupied' | 'selected';
  price: number;
}

export interface Session {
  id: string;
  movieId: string;
  movieTitle: string;
  room: string;
  technology: string;
  time: string;
  date: string;
  isToday: boolean;
  seats: Seat[];
  price: number;
  type: string;
  seatTypes: SessionType[];
}

interface SessionState {
  currentSession: Session | null;
  sessions: Session[];
  selectedSession: Session | null;
  loading: boolean;
  error: string | null;
  fetchSession: (sessionId: string) => Promise<void>;
  loadSessions: (movieId: number, movieTitle: string) => Promise<void>;
  setSelectedSession: (sessionId: string) => void;
  selectedSeats: string[];
  selectSeat: (seatId: string) => void;
  unselectSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  prefetchSession: (sessionId: string) => void;
  orderSummary: {
    sessionId: string;
    movieTitle: string;
    date: string;
    time: string;
    seats: string[];
    totalPrice: number;
  } | null;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const sessionCache = new Map<number, { data: Session[]; timestamp: number }>();

// Cache de assentos para evitar regeneração
const seatsCache = new Map<string, Seat[]>();

// Cache de assentos pré-gerados para todas as configurações possíveis
const SEAT_LAYOUTS = {
  standard: generateSeatLayout('standard'),
  premium: generateSeatLayout('premium'),
  vip: generateSeatLayout('vip'),
  imax: generateSeatLayout('imax'),
} as const;

// Pré-gerar layouts de assentos para cada tipo de sala
function generateSeatLayout(roomType: string): Seat[] {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  rows.forEach(row => {
    for (let i = 1; i <= 8; i++) {
      const number = String(i).padStart(2, '0');
      const id = `${row}${number}`;
      
      let type: Seat['type'] = 'standard';
      if (['G02', 'G06'].includes(id)) type = 'couple';
      if (['E04', 'E05', 'F04', 'F05'].includes(id)) type = 'premium';
      if (['G01', 'G03', 'G05'].includes(id)) type = 'wheelchair';
      
      seats.push({
        id,
        row,
        number,
        type,
        status: 'available',
        price: calculatePrice(type, roomType),
      });
    }
  });
  
  return seats;
}

// Calcular preço baseado no tipo de assento e sala
function calculatePrice(seatType: Seat['type'], roomType: string): number {
  const basePrice = 
    roomType === 'imax' ? 45 :
    roomType === 'vip' ? 50 :
    roomType === 'premium' ? 40 :
    35;

  return seatType === 'couple' ? basePrice * 1.8 :
         seatType === 'premium' ? basePrice * 1.3 :
         basePrice;
}

// Gerar status de ocupação rapidamente
function generateSeatStatus(seats: Seat[]): Seat[] {
  return seats.map(seat => ({
    ...seat,
    status: Math.random() > 0.8 ? 'occupied' : 'available'
  }));
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
  selectedSeats: [],
  orderSummary: null,
  
  selectSeat: (seatId: string) => {
    set(state => ({
      selectedSeats: [...state.selectedSeats, seatId]
    }));
  },

  unselectSeat: (seatId: string) => {
    set(state => ({
      selectedSeats: state.selectedSeats.filter(id => id !== seatId)
    }));
  },

  clearSelectedSeats: () => {
    set({ selectedSeats: [] });
  },

  setSelectedSession: (sessionId: string) => {
    const sessions = get().sessions;
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      // Primeiro setamos loading para true
      set({ loading: true });

      // Geramos os assentos antes de atualizar a sessão
      const baseLayout = SEAT_LAYOUTS[session.type.toLowerCase() as keyof typeof SEAT_LAYOUTS] || SEAT_LAYOUTS.standard;
      const seatsWithStatus = generateSeatStatus(baseLayout);
      
      const sessionWithSeats = {
        ...session,
        seats: seatsWithStatus
      };
      
      // Atualizamos tudo de uma vez
      set({ 
        selectedSession: sessionWithSeats,
        currentSession: sessionWithSeats,
        loading: false
      });
    }
  },

  prefetchSession: (sessionId: string) => {
    const sessions = get().sessions;
    const session = sessions.find(s => s.id === sessionId);
    
    if (session) {
      // Pré-gerar assentos e guardar no cache
      const baseLayout = SEAT_LAYOUTS[session.type.toLowerCase() as keyof typeof SEAT_LAYOUTS] || SEAT_LAYOUTS.standard;
      const seatsWithStatus = generateSeatStatus(baseLayout);
      
      // Guardar no cache de assentos
      seatsCache.set(sessionId, seatsWithStatus);
    } else {
      mockFetchSession(sessionId).then(session => {
        const baseLayout = SEAT_LAYOUTS[session.type.toLowerCase() as keyof typeof SEAT_LAYOUTS] || SEAT_LAYOUTS.standard;
        const seatsWithStatus = generateSeatStatus(baseLayout);
        
        // Guardar no cache de assentos
        seatsCache.set(sessionId, seatsWithStatus);
      });
    }
  },

  fetchSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      const currentSession = get().currentSession;
      if (currentSession?.id === sessionId) {
        set({ loading: false });
        return;
      }

      // Verificar cache de assentos primeiro
      const cachedSeats = seatsCache.get(sessionId);
      const sessions = get().sessions;
      const cachedSession = sessions.find(s => s.id === sessionId);

      if (cachedSession && cachedSeats) {
        const sessionWithSeats = {
          ...cachedSession,
          seats: cachedSeats
        };
        set({ currentSession: sessionWithSeats, loading: false });
        return;
      }

      const response = await mockFetchSession(sessionId);
      const baseLayout = SEAT_LAYOUTS[response.type.toLowerCase() as keyof typeof SEAT_LAYOUTS] || SEAT_LAYOUTS.standard;
      const seatsWithStatus = generateSeatStatus(baseLayout);
      
      const sessionWithSeats = {
        ...response,
        seats: seatsWithStatus
      };

      // Guardar no cache
      seatsCache.set(sessionId, seatsWithStatus);
      set({ currentSession: sessionWithSeats, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessão', loading: false });
    }
  },

  loadSessions: async (movieId: number, movieTitle: string) => {
    set({ loading: true, error: null });
    try {
      // Check cache first
      const cached = sessionCache.get(movieId);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < CACHE_EXPIRY) {
        set({ sessions: cached.data, loading: false });
        return;
      }

      const response = await mockLoadSessions(movieId, movieTitle);
      
      // Update cache
      sessionCache.set(movieId, { data: response, timestamp: now });
      set({ sessions: response, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessões', loading: false });
    }
  },

  confirmSeatsSelection: () => {
    const { currentSession, selectedSeats } = get();
    
    if (!currentSession || selectedSeats.length === 0) return;

    set({
      orderSummary: {
        sessionId: currentSession.id,
        movieTitle: currentSession.movieTitle,
        date: currentSession.date,
        time: currentSession.time,
        seats: selectedSeats,
        totalPrice: selectedSeats.length * currentSession.price
      }
    });
  },

  clearOrderSummary: () => set({ orderSummary: null }),
}));

// Função auxiliar para gerar data e hora aleatória nos próximos 7 dias
const generateRandomDateTime = (usedDateTimes: string[]) => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  // Gerar data aleatória entre hoje e próxima semana
  const randomDate = new Date(
    today.getTime() + Math.random() * (nextWeek.getTime() - today.getTime())
  );
  
  // Gerar horário entre 10:00 e 23:00
  const hour = Math.floor(Math.random() * (23 - 10) + 10);
  const minute = Math.random() < 0.5 ? '00' : '30';
  
  // Formatar data e hora
  const date = randomDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  });
  const time = `${hour.toString().padStart(2, '0')}:${minute}`;
  const dateTime = `${date} ${time}`;
  
  // Se já existe essa data e hora, gerar outra
  if (usedDateTimes.includes(dateTime)) {
    return generateRandomDateTime(usedDateTimes);
  }
  
  return {
    date,
    time,
    dateTime,
    isToday: date === today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  };
};

// Função auxiliar para gerar uma sala aleatória
const generateRandomRoom = () => {
  const roomNumber = Math.floor(Math.random() * 8) + 1; // Salas de 1 a 8
  const technologies = [
    { tech: 'IMAX', types: ['imax', '3d'] },
    { tech: '3D', types: ['3d', 'dbox'] },
    { tech: 'VIP', types: ['vip', 'standard'] },
    { tech: '2D', types: ['standard'] },
    { tech: 'D-BOX', types: ['dbox', 'standard'] },
  ];
  
  const selectedTech = technologies[Math.floor(Math.random() * technologies.length)];
  
  return {
    number: roomNumber,
    technology: selectedTech.tech,
    seatTypes: selectedTech.types as SessionType[],
    price: selectedTech.tech === 'IMAX' ? 45.00 :
           selectedTech.tech === 'VIP' ? 50.00 :
           selectedTech.tech === 'D-BOX' ? 40.00 :
           selectedTech.tech === '3D' ? 35.00 : 25.00
  };
};

// Mock para carregar lista de sessões
const mockLoadSessions = async (movieId: number, movieTitle: string): Promise<Session[]> => {
  return new Promise((resolve) => {
    // Garantir pelo menos 4 sessões por dia nos próximos 3 dias
    const sessions: Session[] = [];
    const usedDateTimes: string[] = [];
    const today = new Date();

    // Gerar sessões para hoje e próximos 2 dias
    for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
      const currentDate = new Date();
      currentDate.setDate(today.getDate() + dayOffset);
      
      // Horários fixos para cada dia (10:00, 14:00, 18:00, 21:00)
      const fixedTimes = ['10:00', '14:00', '18:00', '21:00'];
      
      fixedTimes.forEach((time, index) => {
        const date = currentDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        });
        
        const room = generateRandomRoom();
        
        sessions.push({
          id: `${movieId}-${sessions.length + 1}`,
          movieId: String(movieId),
          movieTitle,
          room: `Sala ${room.number}`,
          technology: room.technology,
          time,
          date,
          isToday: dayOffset === 0,
          seats: [],
          price: room.price,
          type: room.technology,
          seatTypes: room.seatTypes,
        });
      });
    }

    // Resolver primeira sessão imediatamente
    resolve([sessions[0]]);

    // Carregar o resto das sessões em batches
    const batchSize = 4;
    let currentIndex = 1;

    const loadNextBatch = () => {
      const batchEnd = Math.min(currentIndex + batchSize, sessions.length);
      const currentBatch = sessions.slice(0, batchEnd);

      // Ordenar sessões
      currentBatch.sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('');
        const dateB = b.date.split('/').reverse().join('');
        if (dateA !== dateB) return dateA.localeCompare(dateB);
        
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });

      // Atualizar o store com as novas sessões
      useSessionStore.setState({ sessions: currentBatch });

      currentIndex = batchEnd;
      
      // Se ainda houver mais sessões para carregar, agendar próximo batch
      if (currentIndex < sessions.length) {
        setTimeout(loadNextBatch, 50); // Reduzido para 50ms para carregar mais rápido
      }
    };

    // Iniciar carregamento lazy após 50ms
    setTimeout(loadNextBatch, 50);
  });
};

// Atualizar o mockFetchSession para ser mais rápido e não gerar assentos
const mockFetchSession = async (sessionId: string): Promise<Session> => {
  const [movieId, sessionNumber] = sessionId.split('-').map(Number);
  const room = generateRandomRoom();
  const { date, time, isToday } = generateRandomDateTime([]);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: sessionId,
        movieId: String(movieId),
        movieTitle: 'Filme',
        room: `Sala ${room.number}`,
        technology: room.technology,
        time,
        date,
        isToday,
        seats: [], // Assentos serão gerados separadamente
        price: room.price,
        type: room.technology,
        seatTypes: room.seatTypes,
      });
    }, 100); // Reduzido para 100ms já que não gera assentos
  });
}; 