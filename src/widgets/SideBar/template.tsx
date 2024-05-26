import styles from './SideBar.module.css';
import {ArrowDown} from '../../shared/ui/icons';
import { appendClassName } from '../../shared/util';

class SideBarTab {
    text: string;
    url: string;
    icon?: any;
    _selected: boolean;
    _expanded: boolean;

    constructor(
        text: string,
        url: string,
        icon?: any,
        selected: boolean = false,
        expanded: boolean = false
    ) {
        this.text = text;
        this.icon = icon;
        this.url = url;
        this._selected = selected;
        this._expanded = expanded;
    }

    public get selected() {
        return this._selected;
    }
    public get expanded() {
        return this._expanded;
    }
    public set selected(value: boolean) {
        this._selected = value;
    }
    public set expanded(value: boolean) {
        this._expanded = value;
    }
}

type Props = {
    tabs: SideBarTab[];
    onClick: (tab: SideBarTab) => void;
};

function SideBar(props: Props) {
    function _tabOnClick(tab: SideBarTab) {
        return () => {
            props.onClick(tab);
        };
    }


    function _createTab(tab: SideBarTab) {
        const entryIcon = tab.icon ? <div className={styles.icon_cnt}>{tab.icon}</div> : <></>;
        let entryText = <div className={styles.text_cnt}>{tab.text}</div>;

        return (
            <div key={tab.url} className={styles.tab}>
                <div
                    className={appendClassName(styles.tab_entry, tab.selected ? styles.selected : null)}
                    onClick={_tabOnClick(tab)}
                >
                    {entryIcon}
                    {entryText}
                </div>
            </div>
        );
    }

    function _createTabList(tabs: SideBarTab[]) {
        const elements = [];
        for (const tab of tabs) {
            elements.push(_createTab(tab));
        }
        return elements;
    }

    return <div className={styles.sidebar}>{_createTabList(props.tabs)}</div>;
}

export default SideBar;
export { SideBarTab };
