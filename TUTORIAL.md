# 🎬 Cine Bossa - Tutorial Completo

## 📋 Índice

1. [Demo](#demo)
2. [Instalação](#instalação)
3. [Arquitetura](#arquitetura)
4. [Design System](#design-system)
5. [Features](#features)
6. [Fluxos](#fluxos)
7. [Desenvolvimento](#desenvolvimento)
8. [API](#api)

## 📱 Demo

https://github.com/seu-usuario/cine-bossa/assets/video/demo.gif

Você também pode assistir ao vídeo completo no YouTube:

[![Cine Bossa Demo](https://img.youtube.com/vi/VIDEO_ID/0.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)

## 📋 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Expo CLI
- iOS Simulator ou Android Emulator (opcional)

### Configuração

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

## 🏗 Arquitetura

### Stack Tecnológica

- **React Native**: Framework base
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Linguagem principal
- **Zustand**: Gerenciamento de estado
- **React Native Paper**: Biblioteca de UI
- **date-fns**: Manipulação de datas
- **Expo Router**: Navegação
- **AsyncStorage**: Armazenamento local

### Estrutura de Pastas

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

## 🔄 Fluxos

### Sistema de Timeout e Limpeza

O aplicativo implementa um sistema de timeout de 50 segundos após a conclusão da compra:

```typescript
const TIMEOUT_DURATION = 50; // 50 segundos

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      if (prev <= 1) {
        clearInterval(timer);
        clearSelectedSeats();
        router.push('/@tickets');
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => {
    clearInterval(timer);
    clearSelectedSeats();
  };
}, []);
```

#### Funcionalidades
1. **Timer Regressivo**
   - Inicia após confirmação da compra
   - Mostra contagem regressiva
   - Redireciona automaticamente

2. **Limpeza de Estado**
   - Limpa assentos selecionados
   - Reseta estado da sessão
   - Previne duplicações

### Navegação

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

## 🛠 Desenvolvimento

### Estado (Zustand)

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
```

### Utilitários

```typescript
// Formatação de Moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Storage Local
export const storage = {
  async save(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async load(key: string): Promise<any> {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
};
```

## 🌐 API

### Configuração

```typescript
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Serviços

```typescript
export class MovieService {
  async getNowPlaying(): Promise<Movie[]>
  async getPopular(): Promise<Movie[]>
  async getUpcoming(): Promise<Movie[]>
  async getMovieDetails(id: string): Promise<MovieDetails>
}
```

## 📚 Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Router](https://expo.github.io/router/docs/) 