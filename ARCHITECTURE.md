# 🏗 Arquitetura do Projeto

## 📁 Estrutura de Pastas


```
src/
├── app/                    # Expo Router pages
├── features/              # Feature-based modules
│   ├── movies/
│   │   ├── components/    # Componentes específicos do módulo
│   │   ├── hooks/        # Hooks específicos
│   │   ├── services/     # Serviços da feature
│   │   ├── stores/       # Estados da feature
│   │   └── types/        # Tipos da feature
│   ├── sessions/
│   └── seats/
├── shared/               # Recursos compartilhados
│   ├── components/       # Componentes reutilizáveis
│   ├── hooks/           # Hooks globais
│   ├── services/        # Serviços base
│   ├── styles/          # Estilos globais
│   └── utils/           # Utilitários
├── core/                # Core da aplicação
│   ├── config/          # Configurações
│   ├── theme/           # Tema global
│   ├── navigation/      # Configuração de navegação
│   └── api/            # Configuração de API
└── assets/             # Recursos estáticos
```

## 🎨 Design System

### Tema Global
O tema global é definido em `src/core/theme/theme.ts` e inclui:

- **Colors**: Paleta de cores consistente
  ```typescript
  colors: {
    primary: '#E50914',
    background: '#000000',
    surface: '#1A1A1A',
    surfaceVariant: '#2A2A2A',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#333333',
    error: '#FF453A',
    success: '#32D74B',
  }
  ```

- **Spacing**: Sistema de espaçamento baseado em REM
  ```typescript
  spacing: {
    xs: rem(0.25),  // 4px
    sm: rem(0.5),   // 8px
    md: rem(1),     // 16px
    lg: rem(1.5),   // 24px
    xl: rem(2),     // 32px
    xxl: rem(3),    // 48px
  }
  ```

- **Typography**: Sistema tipográfico consistente
  ```typescript
  typography: {
    h1: { fontSize: rem(2), lineHeight: rem(2.5), fontWeight: '700' },
    h2: { fontSize: rem(1.75), lineHeight: rem(2.25), fontWeight: '700' },
    h3: { fontSize: rem(1.5), lineHeight: rem(2), fontWeight: '600' },
    body: { fontSize: rem(1), lineHeight: rem(1.5), fontWeight: '400' },
    caption: { fontSize: rem(0.875), lineHeight: rem(1.25), fontWeight: '400' },
  }
  ```

### Responsividade
- Uso de unidade REM para medidas
- Função utilitária para conversão:
  ```typescript
  const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16);
  ```

## 📏 Conversão PX para REM

### Função Base
```typescript
const rem = (value: number) => PixelRatio.roundToNearestPixel(value * 16);
```

### Guia de Conversão
| Pixels | REM    | Uso Comum                |
|--------|--------|--------------------------|
| 4px    | 0.25   | Espaçamentos mínimos     |
| 8px    | 0.5    | Padding pequeno          |
| 12px   | 0.75   | Border radius            |
| 16px   | 1      | Padding/Margin padrão    |
| 20px   | 1.25   | Ícones pequenos          |
| 24px   | 1.5    | Ícones médios            |
| 32px   | 2      | Títulos                  |
| 40px   | 2.5    | Botões grandes           |
| 48px   | 3      | Elementos destacados     |
| 64px   | 4      | Imagens pequenas         |

### Exemplos de Uso

#### Antes (com px):
```typescript
const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  title: {
    fontSize: 32,a
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});
```

#### Depois (com rem):
```typescript
const styles = StyleSheet.create({
  container: {
    padding: rem(1),
    marginBottom: rem(1.5),
    borderRadius: rem(0.5),
  },
  title: {
    fontSize: rem(2),
    marginBottom: rem(1),
  },
  icon: {
    width: rem(1.5),
    height: rem(1.5),
  },
});
```

### Componentes Comuns

#### Botões
```typescript
button: {
  height: rem(3),         // 48px
  paddingHorizontal: rem(1.25), // 20px
  borderRadius: rem(0.75),     // 12px
},
buttonIcon: {
  width: rem(1.5),       // 24px
  height: rem(1.5),      // 24px
},
```

#### Cards
```typescript
card: {
  padding: rem(1),       // 16px
  margin: rem(0.75),     // 12px
  borderRadius: rem(1),  // 16px
},
cardImage: {
  height: rem(12),       // 192px
  borderRadius: rem(0.5), // 8px
},
```

#### Headers
```typescript
header: {
  height: rem(3.5),      // 56px
  paddingHorizontal: rem(1), // 16px
},
headerTitle: {
  fontSize: rem(1.25),   // 20px
  marginLeft: rem(0.75), // 12px
},
```

### Dicas de Uso

1. **Consistência**
   - Sempre use rem() para medidas
   - Evite números mágicos
   - Mantenha a escala consistente

2. **Performance**
   - Memoize valores comuns
   - Use constantes para valores repetidos
   ```typescript
   const SPACING = {
     xs: rem(0.25),
     sm: rem(0.5),
     md: rem(1),
     lg: rem(1.5),
     xl: rem(2),
   };
   ```

3. **Responsividade**
   - Use multiplicadores para telas maiores
   ```typescript
   const scale = width > 375 ? 1.2 : 1;
   const dynamicSpacing = rem(1) * scale;
   ```

4. **Componentes**
   - Crie componentes base que já usam rem
   ```typescript
   const Spacing = styled.View<{ size: keyof typeof SPACING }>`
     height: ${({ size }) => SPACING[size]}px;
   `;
   ```

## 🏗 Arquitetura

### Feature-First
Cada feature é um módulo independente contendo:
- Components
- Services
- Stores
- Types
- Hooks específicos

### Clean Architecture
- **Presentation Layer**: Components e Hooks
- **Domain Layer**: Types e Interfaces
- **Data Layer**: Services e API Calls

## 🔄 Estado da Aplicação

### Store Pattern
```typescript
interface MovieState {
  sections: {
    nowPlaying: MovieSection;
    popular: MovieSection;
    upcoming: MovieSection;
    topRated: MovieSection;
  };
  loading: boolean;
  error: string | null;
}
```

### Services Pattern
```typescript
class MovieService {
  async getNowPlaying(page: number = 1): Promise<MovieResponse>
  async getPopular(page: number = 1): Promise<MovieResponse>
  async getUpcoming(page: number = 1): Promise<MovieResponse>
  async getTopRated(page: number = 1): Promise<MovieResponse>
  async getMovieDetails(movieId: number): Promise<Movie>
}
```

## 🌐 API Layer

### Cliente HTTP
```typescript
export const apiClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Interceptors
- Request: Configuração de headers e tokens
- Response: Tratamento global de erros

## 🎨 Componentes UI

### Padrões de Estilo
- Uso do tema global via hook `useTheme`
- Estilos consistentes e tipados
- Sistema de sombras e elevação

### Glass Morphism
```typescript
glass: {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  dark: {
    backgroundColor: 'rgba(28, 28, 30, 0.6)',
    backdropFilter: 'blur(10px)',
  },
}
```

## 📱 Navegação
- Baseada em Expo Router
- Navegação tipo Stack
- Rotas tipadas

## 🔧 Utilitários

### Hooks Compartilhados
```typescript
export const useTheme = () => {
  return {
    ...theme,
    getColor: (color: ThemeColors) => theme.colors[color],
    getSpacing: (spacing: ThemeSpacing) => theme.spacing[spacing],
    getTypography: (typography: ThemeTypography) => theme.typography[typography],
  };
};
```

## 🚀 Boas Práticas

1. **Componentização**
   - Componentes pequenos e reutilizáveis
   - Props tipadas
   - Memoização quando necessário

2. **Performance**
   - Lazy loading de features
   - Memoização de callbacks
   - Otimização de re-renders

3. **Tipagem**
   - TypeScript em todo o projeto
   - Interfaces bem definidas
   - Types exportados e reutilizáveis

4. **Estilo**
   - Uso consistente do tema
   - Responsividade via REM
   - Design system unificado

## 📦 Dependências Principais

- **Expo**: Framework base
- **React Navigation**: Navegação
- **Axios**: Cliente HTTP
- **Zustand**: Gerenciamento de estado
- **React Native Paper**: UI Components 