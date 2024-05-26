import { Api } from '../../entities/Api';
import ApiContext, { ApiContextValue } from '../../features/api-context';
import { AuthenticationContextData, getAuthenticationContextData, setAuthenticationContextData } from '../../shared/lib/token';
import { useState } from 'react';

type Props = {
    children: any;
};

const ApiContextProvider = (props: Props) => {
    const [authenticationContext, setAuthenticationContext] = useState(getAuthenticationContextData());

    function _setAuthenticationContext(context: AuthenticationContextData) {
        setAuthenticationContextData(context);
        setAuthenticationContext(context);
    }

    function _resetToken() {
        _setAuthenticationContext(new AuthenticationContextData());
    }

    const contextValue: ApiContextValue = {
        api: new Api(setAuthenticationContext, authenticationContext),
        setAuthentication: _setAuthenticationContext,
        resetAuthentication: _resetToken,
    };

    return <ApiContext.Provider value={contextValue}>{props.children}</ApiContext.Provider>;
};

export default ApiContextProvider;
