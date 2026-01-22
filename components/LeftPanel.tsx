import React from 'react';
import * as Icons from '../icons';
import { useStore } from '../store/index';
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { SettingsPanel } from './panels/SettingsPanel';
import { CharacterListPanel } from './panels/CharacterListPanel';
import { WorldListPanel } from './panels/WorldListPanel';
import { KnowledgeListPanel } from './panels/KnowledgeListPanel';
import { PlotListPanel } from './panels/PlotListPanel';
import { OutlinePanel } from './panels/OutlinePanel';
import { LeftPanelTab } from '../types';
import { Tooltip } from './Tooltip';

interface LeftPanelProps {
    onExportProject: () => void;
    onExportTxt: () => void;
    isMobile?: boolean;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({ onExportProject, onExportTxt, isMobile = false }) => {
    const {
        leftSidebarWidth,
        saveStatus,
        leftPanelTab,
        setLeftPanelTab,
        setActiveProjectId,
        isSimpleMode,
        userMode,
        setIsLeftSidebarOpen
    } = useStore(state => ({
        leftSidebarWidth: state.leftSidebarWidth,
        saveStatus: state.saveStatus,
        leftPanelTab: state.leftPanelTab,
        setLeftPanelTab: state.setLeftPanelTab,
        setActiveProjectId: state.setActiveProjectId,
        isSimpleMode: state.allProjectsData[state.activeProjectId]?.isSimpleMode,
        userMode: state.userMode,
        setIsLeftSidebarOpen: state.setIsLeftSidebarOpen,
    }));

    const resizeTransitionClass = isMobile ? '' : 'transition-[width] duration-300 ease-in-out';
    const widthStyle = isMobile ? { width: '100%', height: '100%' } : { width: `${leftSidebarWidth}px` };
    
    const renderContent = () => {
        if (isSimpleMode) {
             return (
                <div className="p-4 space-y-4">
                    <SettingsPanel onExportProject={onExportProject} onExportTxt={onExportTxt} />
                    <CharacterListPanel isMobile={isMobile} />
                    <WorldListPanel isMobile={isMobile} />
                </div>
            );
        }

        const currentTabId = userMode === 'simple' ? 'settings' : leftPanelTab;
        
        switch (currentTabId) {
            case 'settings': return <SettingsPanel onExportProject={onExportProject} onExportTxt={onExportTxt} />;
            case 'characters': return <CharacterListPanel isMobile={isMobile} />;
            case 'worlds': return <WorldListPanel isMobile={isMobile} />;
            case 'knowledge': return <KnowledgeListPanel isMobile={isMobile} />;
            case 'plots': return <PlotListPanel isMobile={isMobile} />;
            case 'outline': return <OutlinePanel isMobile={isMobile} />;
            default: return null;
        }
    };
    
    const tabs: { id: LeftPanelTab; icon: React.ReactNode; label: string; }[] = [
        { id: 'settings', icon: <Icons.SettingsIcon />, label: '設定' },
        { id: 'characters', icon: <Icons.UserPlusIcon />, label: 'キャラ' },
        { id: 'worlds', icon: <Icons.GlobeIcon />, label: '世界観' },
        { id: 'knowledge', icon: <Icons.LightbulbIcon />, label: 'ナレッジ' },
        { id: 'plots', icon: <Icons.ClipboardListIcon />, label: 'プロット' },
        { id: 'outline', icon: <Icons.ListOrderedIcon />, label: '構成' },
    ];

    return (
        <div
            className={`flex-shrink-0 bg-gray-800 flex flex-col ${resizeTransitionClass} border-r border-gray-700/50`}
            style={widthStyle}
            id="tutorial-left-panel"
        >
            {isMobile && (
                <div className="flex items-center justify-between p-2 bg-gray-900 border-b border-gray-700/50">
                     <h3 className="text-sm font-bold text-gray-300 ml-2">設定・ツール</h3>
                     <button 
                        onClick={() => setIsLeftSidebarOpen(false)}
                        className="p-2 text-gray-400 hover:text-white"
                    >
                        <Icons.XIcon className="h-5 w-5" />
                    </button>
                </div>
            )}
            
            {isMobile && !isSimpleMode && userMode !== 'simple' && (
                <div className="flex overflow-x-auto bg-gray-900 border-b border-gray-700/50 no-scrollbar flex-shrink-0">
                    {tabs.map(tab => (
                         <button
                            key={tab.id}
                            onClick={() => setLeftPanelTab(tab.id)}
                            className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2 text-xs min-w-[60px] ${leftPanelTab === tab.id ? 'text-indigo-400 border-b-2 border-indigo-400 bg-gray-800' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
                        >
                            {React.cloneElement<any>(tab.icon as React.ReactElement, { className: 'h-5 w-5 mb-1' })}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-grow flex flex-col overflow-hidden">
                {!isMobile && (
                    <div className="p-4 border-b border-gray-700/50 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <Tooltip helpId="settings">
                                <button onClick={() => setActiveProjectId(null)} className="flex items-center text-sm text-gray-300 hover:text-white transition btn-pressable">
                                    <Icons.ArrowLeftIcon />
                                    プロジェクト一覧へ
                                </button>
                            </Tooltip>
                            <SaveStatusIndicator status={saveStatus} />
                        </div>
                    </div>
                )}
                <div className="flex-grow overflow-y-auto pb-20 sm:pb-0">
                    {renderContent()}
                    {isMobile && (
                         <div 
                            className="p-4 mt-4 border-t border-gray-700"
                            style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
                         >
                            <button onClick={() => setActiveProjectId(null)} className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md transition btn-pressable">
                                <Icons.ArrowLeftIcon className="h-4 w-4"/>
                                <span>プロジェクト一覧へ</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
