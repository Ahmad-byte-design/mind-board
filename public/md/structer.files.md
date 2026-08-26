src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   │
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   └── AppProviders.tsx
│   │
│   └── layouts/
│       ├── AuthLayout.tsx
│       └── AppLayout.tsx
│
├── assets/
│   ├── images/
│   ├── textures/
│   └── fonts/
│
├── components/
│   ├── ui/
│   └── common/
│
├── constants/
│   ├── app.constants.ts
│   ├── routes.constants.ts
│   ├── query.constants.ts
│   └── ui.constants.ts
│
├── config/
│   ├── env.ts
│   └── routes.ts
│
├── features/
│   │
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthGuard.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── useLogin.ts
│   │   │   │   ├── useRegister.ts
│   │   │   │   ├── useLogout.ts
│   │   │   │   └── useCurrentUser.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       └── useAuthForm.ts
│   │   │
│   │   ├── store/
│   │   │   └── auth.store.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── auth.schema.ts
│   │   ├── constants/
│   │   │   └── auth.constants.ts
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   └── index.ts
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   └── pages.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── PageList.tsx
│   │   │   ├── PageCard.tsx
│   │   │   ├── CreatePageDialog.tsx
│   │   │   └── PageHeader.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── usePages.ts
│   │   │   │   ├── usePage.ts
│   │   │   │   ├── useCreatePage.ts
│   │   │   │   ├── useUpdatePage.ts
│   │   │   │   └── useDeletePage.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── usePageSelection.ts
│   │   │       └── usePageFilters.ts
│   │   │
│   │   ├── store/
│   │   │   └── pages.store.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── page.schema.ts
│   │   ├── constants/
│   │   │   └── pages.constants.ts
│   │   ├── types/
│   │   │   └── page.types.ts
│   │   └── index.ts
│   │
│   ├── papers/
│   │   ├── api/
│   │   │   └── papers.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── PaperDetailsPanel.tsx
│   │   │   ├── CreatePaperDialog.tsx
│   │   │   ├── EditPaperForm.tsx
│   │   │   ├── PaperStatus.tsx
│   │   │   └── PaperActions.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── usePapers.ts
│   │   │   │   ├── usePaper.ts
│   │   │   │   ├── useCreatePaper.ts
│   │   │   │   ├── useUpdatePaper.ts
│   │   │   │   ├── useDeletePaper.ts
│   │   │   │   └── useUpdatePaperPosition.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── usePaperSelection.ts
│   │   │       └── usePaperActions.ts
│   │   │
│   │   ├── store/
│   │   │   └── papers.store.ts
│   │   │
│   │   ├── schemas/
│   │   │   └── paper.schema.ts
│   │   ├── constants/
│   │   │   └── papers.constants.ts
│   │   ├── types/
│   │   │   └── paper.types.ts
│   │   └── index.ts
│   │
│   ├── strings/
│   │   ├── api/
│   │   │   └── strings.api.ts
│   │   │
│   │   ├── components/
│   │   │   └── StringRelationshipDialog.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── useStrings.ts
│   │   │   │   ├── useString.ts
│   │   │   │   ├── useCreateString.ts
│   │   │   │   └── useDeleteString.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       └── useStringSelection.ts
│   │   │
│   │   ├── store/
│   │   │   └── strings.store.ts
│   │   ├── schemas/
│   │   │   └── string.schema.ts
│   │   ├── constants/
│   │   │   └── strings.constants.ts
│   │   ├── types/
│   │   │   └── string.types.ts
│   │   └── index.ts
│   │
│   ├── board/
│   │   ├── components/
│   │   │   ├── LearningBoard.tsx
│   │   │   ├── BoardToolbar.tsx
│   │   │   ├── BoardControls.tsx
│   │   │   ├── BoardBackground.tsx
│   │   │   └── BoardMinimap.tsx
│   │   │
│   │   ├── nodes/
│   │   │   ├── PaperNode.tsx
│   │   │   ├── PaperNodeHeader.tsx
│   │   │   ├── PaperNodeContent.tsx
│   │   │   ├── PaperNodePin.tsx
│   │   │   └── PaperNodeHandles.tsx
│   │   │
│   │   ├── edges/
│   │   │   ├── RedStringEdge.tsx
│   │   │   ├── StringLabel.tsx
│   │   │   └── edge.utils.ts
│   │   │
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   └── useSaveBoard.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── useBoard.ts
│   │   │       ├── useBoardPersistence.ts
│   │   │       ├── useBoardShortcuts.ts
│   │   │       └── useBoardViewport.ts
│   │   │
│   │   ├── store/
│   │   │   └── board.store.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── node.mapper.ts
│   │   │   ├── edge.mapper.ts
│   │   │   ├── board.serializer.ts
│   │   │   └── board.utils.ts
│   │   │
│   │   ├── constants/
│   │   │   └── board.constants.ts
│   │   │
│   │   ├── types/
│   │   │   └── board.types.ts
│   │   └── index.ts
│   │
│   ├── ai/
│   │   ├── api/
│   │   │   └── ai.api.ts
│   │   ├── components/
│   │   │   ├── AIAssistant.tsx
│   │   │   ├── AIGeneratePage.tsx
│   │   │   ├── AIBuildingAnimation.tsx
│   │   │   ├── AIMessage.tsx
│   │   │   └── AIPromptInput.tsx
│   │   ├── hooks/
│   │   │   ├── api/
│   │   │   │   ├── useGenerateLearningPath.ts
│   │   │   │   ├── useAskAI.ts
│   │   │   │   └── useGenerateChallenge.ts
│   │   │   │
│   │   │   └── ui/
│   │   │       ├── useAIAssistant.ts
│   │   │       └── useAIGenerationAnimation.ts
│   │   ├── store/
│   │   │   └── ai.store.ts
│   │   ├── schemas/
│   │   │   └── ai.schema.ts
│   │   ├── constants/
│   │   │   └── ai.constants.ts
│   │   ├── types/
│   │   │   └── ai.types.ts
│   │   └── index.ts
│   │
│   └── learning/
│       ├── components/
│       │   ├── LearningProgress.tsx
│       │   ├── LearningGoal.tsx
│       │   ├── PracticeChallenge.tsx
│       │   └── LearningStats.tsx
│       ├── hooks/
│       │   ├── api/
│       │   │   └── useLearningProgress.ts
│       │   └── ui/
│       │       └── useLearningFilters.ts
│       ├── store/
│       │   └── learning.store.ts
│       ├── constants/
│       │   └── learning.constants.ts
│       ├── types/
│       │   └── learning.types.ts
│       └── index.ts
│
├── hooks/
│   ├── useDebounce.ts
│   ├── useMediaQuery.ts
│   └── useKeyboardShortcut.ts
│
├── lib/
│   ├── axios.ts
│   ├── query-client.ts
│   ├── utils.ts
│   └── motion.ts
│
├── types/
│   ├── api.types.ts
│   └── common.types.ts
│
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── LearningPage.tsx
│   └── NotFoundPage.tsx
│
└── main.tsx