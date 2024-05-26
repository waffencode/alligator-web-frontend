import { RouteProps } from 'react-router-dom';

interface SecuredRouteProps {
    path?: string;
    authenticated?: boolean;
}

type AppRouteProps = SecuredRouteProps & RouteProps;

export type { AppRouteProps };
