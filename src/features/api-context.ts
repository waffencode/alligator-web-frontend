import { Api } from '../entities/Api';
import { AuthenticationContextData } from '../shared/lib/authentication';
import { createContext } from 'react';

type ApiContextValue = {
    api: Api;
    setAuthentication: (token: AuthenticationContextData) => void;
    resetAuthentication: () => void;
};

const ApiContext = createContext({} as ApiContextValue);

export type { ApiContextValue };
export default ApiContext;
