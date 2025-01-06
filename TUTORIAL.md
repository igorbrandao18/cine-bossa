# 🎬 Cine Bossa - Tutorial Completo

## 📋 Demo

https://github.com/seu-usuario/cine-bossa/assets/video/demo.gif

Você também pode assistir ao vídeo completo no YouTube:

[![Cine Bossa Demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

## 📋 Começando

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI
- iOS Simulator ou Android Emulator (opcional)

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/cine-bossa.git
cd cine-bossa
```

2. Instale as dependências
```bash
npm install
# ou
yarn install
```

3. Inicie o projeto
```bash
npm start
# ou
yarn start
```

4. Execute em um dispositivo
- Pressione `i` para iOS
- Pressione `a` para Android
- Ou escaneie o QR Code com o app Expo Go no seu celular

### Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento
- `npm run ios`: Inicia o app no iOS Simulator
- `npm run android`: Inicia o app no Android Emulator
- `npm run web`: Inicia o app no navegador
- `npm run test`: Executa os testes
- `npm run lint`: Verifica problemas de linting
- `npm run build`: Gera o build de produção

## 📋 Índice

1. [Introdução](#introdução)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Design System](#design-system)
5. [Features](#features)
6. [API e Integração](#api-e-integração)
7. [Estado da Aplicação](#estado-da-aplicação)
8. [Navegação](#navegação)
9. [Componentes](#componentes)
10. [Utilitários](#utilitários)

## 🎯 Introdução

O Cine Bossa é um aplicativo de cinema moderno desenvolvido com React Native e Expo, oferecendo uma experiência completa de compra de ingressos, desde a escolha do filme até a confirmação da compra.

## 🛠 Tecnologias Utilizadas

- **React Native**: Framework base
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Linguagem principal
- **Zustand**: Gerenciamento de estado
- **React Native Paper**: Biblioteca de UI
- **date-fns**: Manipulação de datas
- **Expo Router**: Navegação
- **AsyncStorage**: Armazenamento local

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Expo Router pages
├── design-system/         # Design System
│   ├── foundations/      # Design Tokens
│   ├── components/      # Componentes do Design System
│   └── themes/         # Temas da aplicação
├── features/           # Módulos baseados em features
│   ├── movies/
│   ├── sessions/
│   ├── seats/
│   ├── tickets/
│   └── confirmation/
├── shared/            # Recursos compartilhados
└── core/             # Core da aplicação
```

## 🎨 Design System

### Foundations (Design Tokens)

```typescript
// colors.ts
export const palette = {
  primary: {
    main: '#E50914',
    light: '#FF1F1F',
    dark: '#B30710',
  },
  // ...
}

// typography.ts
export const typography = {
  families: {
    primary: 'System',
    secondary: 'System',
  },
  sizes: {
    xs: rem(0.75),    // 12px
    sm: rem(0.875),   // 14px
    md: rem(1),       // 16px
  },
  // ...
}
```

### Componentes Base

- **Button**: Botões customizáveis
- **Text**: Componente de texto com estilos predefinidos
- **Card**: Container com sombra e bordas arredondadas
- **Icon**: Wrapper para ícones do MaterialIcons

## 🎯 Features

### Movies

- Lista de filmes em cartaz
- Detalhes do filme
- Categorias (Em alta, Próximos lançamentos, etc.)

### Sessions

- Listagem de sessões por filme
- Filtro por data
- Detalhes da sessão (horário, sala, tecnologia)

### Seats

- Mapa de assentos interativo
- Seleção múltipla
- Tipos diferentes de assentos (standard, premium, etc.)

### Tickets

- Histórico de ingressos
- QR Code para cada ingresso
- Status do ingresso (válido, usado, expirado)

## 🌐 API e Integração

### Configuração do Axios

```typescript
// core/api/axios.ts
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors
apiClient.interceptors.request.use(config => {
  // Configuração de headers
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    return Promise.reject(error);
  }
);
```

### Serviços

```typescript
// features/movies/services/movieService.ts
export class MovieService {
  async getNowPlaying(): Promise<Movie[]>
  async getPopular(): Promise<Movie[]>
  async getUpcoming(): Promise<Movie[]>
  async getMovieDetails(id: string): Promise<MovieDetails>
}
```

## 🔄 Estado da Aplicação

### Stores (Zustand)

```typescript
// MovieStore
interface MovieState {
  sections: {
    nowPlaying: MovieSection;
    popular: MovieSection;
    upcoming: MovieSection;
  };
  loading: boolean;
  error: string | null;
}

// SessionStore
interface SessionState {
  selectedSession: Session | null;
  selectedSeats: string[];
  loading: boolean;
}

// TicketStore
interface TicketStore {
  tickets: Ticket[];
  addTicket: (ticket: TicketData) => void;
  loadTickets: () => Promise<void>;
}
```

## 🧭 Navegação

### Estrutura de Rotas

```typescript
export const APP_ROUTES = {
  HOME: '/',
  MOVIES: {
    LIST: '/movies',
    DETAILS: (movieId: string) => `/movies/${movieId}`,
  },
  SESSIONS: {
    LIST: (movieId: string) => `/movies/${movieId}/sessions`,
    DETAILS: (sessionId: string) => `/sessions/${sessionId}`,
  },
  SEATS: {
    SELECT: (sessionId: string) => `/seats/${sessionId}`,
  },
  TICKETS: '/@tickets',
};
```

### Tabs Navigation

```typescript
const TABS = [
  {
    name: 'home',
    label: 'Home',
    icon: 'movie-open',
    path: '/',
  },
  {
    name: 'explore',
    label: 'Explorar',
    icon: 'compass',
    path: '/explore',
  },
  {
    name: 'tickets',
    label: 'Ingressos',
    icon: 'ticket',
    path: '/@tickets',
  },
];
```

## 🧩 Componentes

### Shared Components

- **Button**: Botão customizável com variantes
- **Card**: Container com sombra
- **Text**: Texto estilizado
- **Icon**: Wrapper para ícones
- **Loading**: Indicador de carregamento
- **ErrorBoundary**: Tratamento de erros
- **CustomFooter**: Footer customizado

### Feature Components

- **MovieCard**: Card de filme
- **SessionItem**: Item de sessão
- **SeatMap**: Mapa de assentos
- **TicketCard**: Card de ingresso

## 🔧 Utilitários

### Formatação

```typescript
// formatCurrency.ts
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// formatDate.ts
export const formatDate = (date: string): string => {
  return format(new Date(date), 'dd/MM/yyyy');
};
```

### Validação

```typescript
// validateCPF.ts
export const validateCPF = (cpf: string): boolean => {
  // Implementação da validação de CPF
};

// validateCard.ts
export const validateCard = (card: CardData): boolean => {
  // Validação de cartão de crédito
};
```

### Storage

```typescript
// storage.ts
export const storage = {
  async save(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  
  async load(key: string): Promise<any> {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};
```

## 🎯 Conclusão

O Cine Bossa é um projeto completo que demonstra boas práticas de desenvolvimento React Native, incluindo:

- Arquitetura escalável baseada em features
- Design System consistente
- Gerenciamento de estado eficiente
- Navegação intuitiva
- Componentização reutilizável
- Integração com APIs
- Persistência de dados local

Para começar a desenvolver:

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o projeto: `npm start`

Para mais informações, consulte a documentação específica de cada feature na pasta `/docs`. 