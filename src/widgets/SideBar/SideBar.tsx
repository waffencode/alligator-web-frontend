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
    const [role, setRole] = useState<string[]>([]);

    const {api} = useContext(ApiContext);

    useEffect(() => {
        // получаем роли

        api.user.whoami()
            .then((user) => {
                setRole(user.roles);
            })
            .catch((err) => {
                console.error('Failed to fetch user roles', err);
            });
      }, []);
    

    const [tabs, setTabs] = useState<SideBarTabE[]>(_getAllTabs());

    function _getAllTabs() {



        return [
            // new SideBarTabE(
            //     new SideBarTab('Мероприятия', RoutePaths.eventList, <Menu />),
            //     anyPrivilege(new Set([new PrivilegeData(PrivilegeNames.VIEW_ALL_EVENTS)]))
            // ),
            // new SideBarTabE(
            //     new SideBarTab('Задачи', RoutePaths.taskList, <Notebook />),
            //     (_) => true
            // ),
            // new SideBarTabE(
            //     new SideBarTab('Площадки', RoutePaths.placeList, <Home />),
            //     anyPrivilege(new Set([new PrivilegeData(PrivilegeNames.VIEW_EVENT_PLACE)]))
            // ),
            // new SideBarTabE(new SideBarTab('Уведомления', RoutePaths.notifications, <Noted />)),
            // new SideBarTabE(
            //     new SideBarTab('Заявки на регистрацию', RoutePaths.requestList, <UserRead />),
            //     anyPrivilege(
            //         new Set([
            //             new PrivilegeData(PrivilegeNames.APPROVE_REGISTRATION_REQUEST),
            //             new PrivilegeData(PrivilegeNames.REJECT_REGISTRATION_REQUEST),
            //         ])
            //     )
            // ),
            // new SideBarTabE(
            //     new SideBarTab('Роли', RoutePaths.roleList, <DocumentCheck />),
            //     anyPrivilege(
            //         new Set([
            //             new PrivilegeData(PrivilegeNames.CREATE_ROLE),
            //             new PrivilegeData(PrivilegeNames.EDIT_ROLE),
            //             new PrivilegeData(PrivilegeNames.DELETE_ROLE),
            //         ])
            //     )
            // ),
            // new SideBarTabE(new SideBarTab('Пользователи', RoutePaths.userList, <Users />),),
            new SideBarTabE(new SideBarTab('Профиль', RoutePaths.profile)),
            //new SideBarTabE(new SideBarTab('Бэклог', RoutePaths.backlog)),
            new SideBarTabE(new SideBarTab('Команды', RoutePaths.availableTeams)),
            new SideBarTabE(new SideBarTab('Спринты', RoutePaths.sprints)),
        ];
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
