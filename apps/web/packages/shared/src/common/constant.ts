export const NavigationRoutes = {
  ForgotPassword: '/forgot-password',
  Home: '/',
  Landing: '/landing',
  Dashboard: '/dashboard',
  Users: '/users',
  Settings: '/settings',
  SetPassword: '/set-password',
  SignIn: '/sign-in',
  SignUp: '/sign-up',
} as const;

export const CacheKey = {
  Auth: 'app:auth',
  PreferSidebarOpen: 'app:prefer-sidebar-open',
  LanguagePreference: 'app:language-preference',
  Theme: 'app:theme',
  InactivityStore: 'app:inactivity',
} as const;

export const LockName = {
  InactivityLeader: 'app:inactivity-leader',
} as const;

export const DevtoolsName = 'App';

export const StoreName = {
  Auth: 'AuthStore',
  TokenExchange: 'TokenExchangeStore',
  Theme: 'ThemeStore',
  Language: 'LanguageStore',
  UIPreferences: 'UIPreferencesStore',
  Inactivity: 'InactivityStore',
  LeaderElection: 'LeaderElectionStore',
} as const;

export const AuthAction = {
  SetAuthData: 'auth/setAuthData',
  RemoveAuthData: 'auth/removeAuthData',
  SetLoginInfo: 'auth/setLoginInfo',
  SetTokens: 'auth/setTokens',
  Logout: 'auth/logout',
} as const;

export const TokenExchangeAction = {
  SetExchangeTokenAction: 'tokenExchange/setExchangeTokenAction',
  ExchangeStart: 'tokenExchange/exchangeOnlyOnce/start',
  ExchangeEnd: 'tokenExchange/exchangeOnlyOnce/end',
} as const;

export const ThemeAction = {
  SetTheme: 'theme/setTheme',
} as const;

export const LanguageAction = {
  SetLanguage: 'language/setLanguage',
} as const;

export const UIPreferencesAction = {
  SavePreferSidebarOpen: 'uiPreferences/savePreferSidebarOpen',
  RemoveSidebarPreference: 'uiPreferences/removeSidebarPreference',
} as const;

export const InactivityAction = {
  StampActivity: 'inactivity/stampActivity',
  ShowWarning: 'inactivity/showWarning',
  HideWarning: 'inactivity/hideWarning',
  Clear: 'inactivity/clear',
} as const;

export const LeaderElectionAction = {
  RequestFallback: 'leaderElection/request/fallback',
  RequestPending: 'leaderElection/request/pending',
  RequestAcquired: 'leaderElection/request/acquired',
  Release: 'leaderElection/release',
} as const;

export const ReactQueryKey = {
  Users: 'users',
  User: 'user',
  Sales: 'data-sales',
  Data: 'data',
  BarData: 'bar',
} as const;
