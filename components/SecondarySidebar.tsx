import React from 'react';
import * as Icons from '../icons';
import { useStore } from '../store/index';
import { LeftPanelTab } from '../types';
import { CharacterListPanel } from './panels/CharacterListPanel';
import { WorldListPanel } from './panels/WorldListPanel';
import { KnowledgeListPanel } from './panels/KnowledgeListPanel';
import { PlotListPanel } from './panels/PlotListPanel';
import { OutlinePanel } from './panels/OutlinePanel';
import { HistoryPanel } from './panels/HistoryPanel';

interface SecondarySidebarProps {
    width: number;
}

const panelMap: Record<LeftPanelTab, { component: React.FC<any>; label: string; icon: React.ReactNode }> = {
    settings: { component: null, label: '設定', icon: <Icons.SettingsIcon /> }, // Settings cannot be pinned
    characters: { component: CharacterListPanel, label: 'キャラクター', icon: <Icons.UserPlusIcon /> },
    worlds: { component: WorldListPanel, label: '世界観', icon: <Icons.GlobeIcon /> },
    knowledge: { component: KnowledgeListPanel, label: 'ナレッジ', icon: <Icons.LightbulbIcon /> },
    plots: { component: PlotListPanel, label: 'プロット', icon: <Icons.ClipboardListIcon /> },
    outline: { component: OutlinePanel, label: 'アウトライン', icon: <Icons.ListOrderedIcon /> },
    history: { component: HistoryPanel, label: '操作履歴', icon: <Icons.HistoryIcon /> },
};

export const SecondarySidebar: React.FC<SecondarySidebarProps> = ({ width }) => {
    const { pinnedPanel, setPinnedPanel } = useStore(state => ({
        pinnedPanel: state.pinnedPanel,
        setPinnedPanel: state.setPinnedPanel,
    }));

    if (!pinnedPanel) return null;

    const PinnedComponent = panelMap[pinnedPanel]?.component;
    const panelInfo = panelMap[pinnedPanel];

    return (
        <div
            className="flex-shrink-0 bg-gray-800 flex flex-col transition-[width] duration-300 ease-in-out border-r border-gray-700/50"
            style={{ width: `${width}px` }}
        >
            <div className="p-2 border-b border-gray-700/50 flex justify-between items-center flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                    {React.cloneElement<any>(panelInfo.icon as React.ReactElement, { className: "h-4 w-4" })}
                    {panelInfo.label}
                </h3>
                <button
                    onClick={() => setPinnedPanel(null)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white btn-pressable"
                    title="ピン留めを解除"
                >
                    <Icons.XIcon className="h-4 w-4" />
                </button>
            </div>
            {PinnedComponent ? <PinnedComponent /> : null}
        </div>
    );
};