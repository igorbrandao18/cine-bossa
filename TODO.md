# 📋 Reorganização do Projeto

## 🎯 Objetivos
- [x] Implementar arquitetura Feature-First
- [ ] Aplicar Clean Architecture
- [ ] Padronizar uso de REM em todo o projeto
- [x] Implementar Design System global

## 1️⃣ Estrutura de Pastas
- [x] Criar nova estrutura de diretórios
- [x] Limpar estrutura antiga
  - [x] Mover arquivos de `/components` para features específicas
  - [x] Mover arquivos de `/screens` para `/app`
  - [x] Mover arquivos de `/services` para features específicas
  - [x] Mover arquivos de `/stores` para features específicas
  - [x] Mover arquivos de `/hooks` para features específicas
  - [x] Mover arquivos de `/utils` para `shared/utils`
  - [x] Mover arquivos de `/styles` para `core/theme`
  - [x] Mover arquivos de `/context` para features específicas
  - [x] Mover arquivos de `/types` para features específicas
  - [x] Remover pastas antigas após migração

## 2️⃣ Feature: Movies
- [x] Mover arquivos para nova estrutura
  - [x] Componentes específicos para `features/movies/components/`
    - [x] `FeaturedMovie.tsx`
    - [x] `MovieRow.tsx`
    - [x] `MovieCard.tsx`
  - [x] Serviços para `features/movies/services/`
    - [x] `movieService.ts`
  - [x] Store para `features/movies/stores/`
    - [x] `movieStore.ts`
  - [x] Tipos para `features/movies/types/`
    - [x] `movie.ts`
  - [x] Hooks específicos para `features/movies/hooks/`
    - [x] `useMovieDetails.ts`
    - [x] `useMovieList.ts`

## 3️⃣ Feature: Sessions
- [x] Mover arquivos para nova estrutura
  - [ ] Componentes específicos para `features/sessions/components/`
    - [ ] `SessionCard.tsx`
    - [ ] `SessionList.tsx`
  - [x] Serviços para `features/sessions/services/`
    - [x] `sessionService.ts`
  - [x] Store para `features/sessions/stores/`
    - [x] `sessionStore.ts`
  - [x] Tipos para `features/sessions/types/`
    - [x] `session.ts`

## 4️⃣ Feature: Seats
- [x] Mover arquivos para nova estrutura
  - [x] Componentes específicos para `features/seats/components/`
    - [x] `SeatComponent.tsx`
    - [x] `FeatureCard.tsx`
    - [x] `SeatsHeader.tsx`
    - [x] `ScreenIndicator.tsx`
    - [x] `SeatItem.tsx`
    - [x] `SeatRow.tsx`
    - [x] `SeatMap.tsx`
  - [ ] Serviços para `features/seats/services/`
    - [ ] `seatService.ts`
  - [ ] Store para `features/seats/stores/`
    - [ ] `seatStore.ts`
  - [x] Tipos para `features/seats/types/`
    - [x] `seat.ts`
  - [x] Estilos para `features/seats/components/styles/`
    - [x] `seats-header.styles.ts`
    - [x] `screen-indicator.styles.ts`
    - [x] `seat-item.styles.ts`
    - [x] `seat-row.styles.ts`
    - [x] `seat-map.styles.ts`

## 5️⃣ Core
- [x] Configurar core da aplicação
  - [x] API em `core/api/`
    - [x] `client.ts`
    - [x] `interceptors.ts`
    - [x] `tmdb.ts`
  - [x] Tema em `core/theme/`
    - [x] `theme.ts`
    - [x] `typography.ts`
    - [x] `spacing.ts`
    - [x] `colors.ts`
  - [x] Configurações em `core/config/`
    - [x] `api.ts`
    - [ ] `env.ts`
  - [x] Serviços em `core/services/`
    - [x] `cache.ts`
  - [x] Tipos em `core/types/`
    - [x] `api.ts`
    - [x] `tmdb.ts`

## 6️⃣ Shared
- [x] Configurar recursos compartilhados
  - [x] Componentes em `shared/components/`
    - [x] `Skeleton.tsx`
  - [ ] Hooks em `shared/hooks/`
  - [ ] Utils em `shared/utils/`

## 7️⃣ Conversão para REM
- [ ] Converter medidas fixas para REM
  - [ ] Movies
    - [ ] `FeaturedMovie.tsx`
    - [ ] `MovieRow.tsx`
  - [ ] Sessions
    - [ ] `SessionCard.tsx`
  - [ ] Seats
    - [ ] `SeatMap.tsx`
  - [ ] Shared Components
    - [ ] `Button.tsx`
    - [ ] `Card.tsx`

## 8️⃣ Testes e Validação
- [x] Verificar funcionamento após reorganização
  - [x] Corrigir imports quebrados
    - [x] Feature Movies
    - [x] Feature Sessions (payment service)
    - [x] Feature Seats (components)
    - [x] Feature Seats (screen)
    - [x] Feature Sessions (screen)
    - [x] Feature Movies (hooks)
    - [x] Feature Movies (screen)
  - [ ] Testar navegação
  - [ ] Testar chamadas API
  - [ ] Testar responsividade
  - [ ] Validar tipagem

## 9️⃣ Documentação
- [ ] Atualizar documentação
  - [ ] README.md
  - [ ] ARCHITECTURE.md
  - [ ] Comentários de código

## 🔄 Processo de Migração (Status Atual)
1. ✅ Nova estrutura de pastas criada
2. ✅ Core configurado
3. ✅ Feature Movies (Completa)
   - ✅ Types
   - ✅ Services
   - ✅ Store
   - ✅ Hooks
   - ✅ Components
   - ✅ Imports atualizados
   - ✅ Screen atualizada
4. ✅ Feature Sessions (Parcial)
   - ✅ Types
   - ✅ Services
   - ✅ Store
   - ⏳ Components
   - ✅ Imports atualizados
   - ✅ Screen atualizada
5. ✅ Feature Seats (Parcial)
   - ✅ Types
   - ✅ Components (Completo)
     - ✅ Componentização da seleção de assentos
     - ✅ Estilos separados por componente
     - ✅ Padrões de projeto implementados (Component, Composition, Props Pattern)
   - ⏳ Services
   - ⏳ Store
   - ✅ Imports atualizados
   - ✅ Screen atualizada
6. ✅ Limpeza
   - ✅ Pastas antigas removidas
   - ✅ Arquivos movidos para novas localizações
   - ✅ Imports atualizados em todas as features

## ⏭️ Próximos Passos
1. Implementar componentes faltantes da feature Sessions
2. Implementar serviços e store da feature Seats
3. Converter medidas para REM
4. Testar navegação e funcionalidades 