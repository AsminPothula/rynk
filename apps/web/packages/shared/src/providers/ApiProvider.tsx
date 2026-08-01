import { createContext, useContext } from 'react';
import { ApiEndpoints } from '../common/api';

const ApiContext = createContext<ApiEndpoints | null>(null);

export const ApiContextProvider = ApiContext.Provider;

export const useApiContext = (): ApiEndpoints => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within an ApiContextProvider');
  }
  return context;
};
