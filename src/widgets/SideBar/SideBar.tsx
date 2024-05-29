import _Sidebar, {SideBarTab} from './template';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import {sharedStart} from '../../shared/util';
import {RoutePaths} from "../../shared/config/routes";

import ApiContext from '../../features/api-context';

type Props = {
    currentPageURL: string;
};

type IsVisibleFunc = (x: Set<string>) => boolean;

function isVisibleFuncTrue(_: Set<string>) {
    return true;
}

class SideBarTabE {
    tab: SideBarTab;
    isVisible: IsVisibleFunc;

    constructor(tab: SideBarTab, isVisible: IsVisibleFunc = isVisibleFuncTrue) {
        this.tab = tab;
        this.isVisible = isVisible;
    }
}

const SideBar = (props: Props) => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState<string[]>([]);

    const {api} = useContext(ApiContext);

    useEffect(() => {
        if(api._authenticationContext.roles) setRoles(api._authenticationContext.roles);
    }, [api]);

    useEffect(() => {
        setTabs(_getAllTabs(roles));
    }, [roles]);

    

    const [tabs, setTabs] = useState<SideBarTabE[]>([]);

    function _getAllTabs(roles: string[]) {

        let content: SideBarTabE[] = [];

        content.push(new SideBarTabE(new SideBarTab('Профиль', RoutePaths.profile)));
        content.push(new SideBarTabE(new SideBarTab('Команды', RoutePaths.availableTeams)));
        content.push(new SideBarTabE(new SideBarTab('Спринты', RoutePaths.sprints)));
        content.push(new SideBarTabE(new SideBarTab('Бэклог', RoutePaths.backlog)));

        if (roles.includes("USER")) {
            
        } 
        if (roles.includes("BUSINESS_ANALYTIC")) {
            
        } 
        if (roles.includes("PROJECT_MANAGER")) {
            content.push(new SideBarTabE(new SideBarTab('Пользователи', RoutePaths.users)));
            content.push(new SideBarTabE(new SideBarTab('Командные роли', RoutePaths.teamRoles)));
        } 
        if (!roles.includes("USER") && !roles.includes("BUSINESS_ANALYTIC") && !roles.includes("PROJECT_MANAGER")) {
            return [
                new SideBarTabE(new SideBarTab('Профиль', RoutePaths.profile))
            ];
        }

        return content;
    }

    function _processSelected(tabs: SideBarTabE[], url: string) {
        return tabs.map((e) => {
            e.tab.selected = sharedStart([e.tab.url, url]) === e.tab.url;
            return e;
        });
    }


    function _getTabs(tabs: SideBarTabE[]) {
        return tabs.map((tab) => tab.tab);
    }

    function _onClick(tab: SideBarTab) {
        navigate(tab.url);
    }

    return <_Sidebar tabs={_getTabs(_processSelected(tabs, props.currentPageURL))} onClick={_onClick} />;
};

export default SideBar;
