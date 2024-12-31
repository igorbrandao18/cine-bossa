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

interface Session {
  id: string;
  movieId: string;
  movieTitle: string;
  room: string;
  technology: string;
  time: string;
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
}

export const useSessionStore = create<SessionState>((set, get) => ({
  currentSession: null,
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
  
  setSelectedSession: (sessionId: string) => {
    const session = get().sessions.find(s => s.id === sessionId);
    if (session) {
      set({ selectedSession: session });
    }
  },

  fetchSession: async (sessionId: string) => {
    set({ loading: true, error: null });
    try {
      // Primeiro verifica se já temos a sessão selecionada
      const selectedSession = get().selectedSession;
      if (selectedSession && selectedSession.id === sessionId) {
        set({ 
          currentSession: selectedSession,
          loading: false 
        });
        return;
      }

      // Se não tiver, busca do mock
      const response = await mockFetchSession(sessionId);
      set({ currentSession: response, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessão', loading: false });
    }
  },

  loadSessions: async (movieId: number, movieTitle: string) => {
    set({ loading: true, error: null });
    try {
      const response = await mockLoadSessions(movieId, movieTitle);
      set({ sessions: response, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar sessões', loading: false });
    }
  }
}));

// Função auxiliar para gerar horários aleatórios entre 10:00 e 23:00
const generateRandomTime = () => {
  const hour = Math.floor(Math.random() * (23 - 10) + 10);
  const minute = Math.random() < 0.5 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
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
    // Gerar entre 3 e 6 sessões aleatórias
    const numberOfSessions = Math.floor(Math.random() * 4) + 3;
    const sessions: Session[] = [];
    
    // Array para controlar horários já usados para não repetir
    const usedTimes: string[] = [];
    
    for (let i = 0; i < numberOfSessions; i++) {
      let time = generateRandomTime();
      // Garantir que não teremos horários repetidos
      while (usedTimes.includes(time)) {
        time = generateRandomTime();
      }
      usedTimes.push(time);
      
      const room = generateRandomRoom();
      
      sessions.push({
        id: `${movieId}-${i + 1}`,
        movieId: String(movieId),
        movieTitle,
        room: `Sala ${room.number}`,
        technology: room.technology,
        time,
        seats: generateSeats(),
        price: room.price,
        type: room.technology,
        seatTypes: room.seatTypes,
      });
    }
    
    // Ordenar sessões por horário
    sessions.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
    });

    setTimeout(() => {
      resolve(sessions);
    }, 1000);
  });
};

// Atualizar o mockFetchSession para usar a mesma lógica
const mockFetchSession = async (sessionId: string): Promise<Session> => {
  const [movieId, sessionNumber] = sessionId.split('-').map(Number);
  const room = generateRandomRoom();

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: sessionId,
        movieId: String(movieId),
        movieTitle: 'Filme',
        room: `Sala ${room.number}`,
        technology: room.technology,
        time: generateRandomTime(),
        seats: generateSeats(),
        price: room.price,
        type: room.technology,
        seatTypes: room.seatTypes,
      });
    }, 1000);
  });
};

const generateSeats = () => {
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
        status: Math.random() > 0.8 ? 'occupied' : 'available',
        price: type === 'couple' ? 70 : type === 'premium' ? 45 : 35,
      });
    }
  });
  
  return seats;
}; 