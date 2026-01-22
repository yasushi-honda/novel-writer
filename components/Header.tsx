
import React, { useState, useEffect, useRef } from 'react';
import * as Icons from '../icons';
import { useStore } from '../store/index';
import { Tooltip } from './Tooltip';

interface HeaderProps {
    displayMenuButtonRef: React.RefObject<HTMLButtonElement>;
    isMobile?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ displayMenuButtonRef, isMobile = false }) => {
    const isLeftSidebarOpen = useStore(state => state.isLeftSidebarOpen);
    const isRightSidebarOpen = useStore(state => state.isRightSidebarOpen);
    const isEditingTitle = useStore(state => state.isEditingTitle);
    const projectTitle = useStore(state => state.projectTitle);
    const activeProjectData = useStore(state => state.allProjectsData[state.activeProjectId]);
    const isSimpleMode = activeProjectData?.isSimpleMode ?? false;
    const activeProjectId = useStore(state => state.activeProjectId);

    const setIsLeftSidebarOpen = useStore(state => state.setIsLeftSidebarOpen);
    const setIsRightSidebarOpen = useStore(state => state.setIsRightSidebarOpen);
    const setProjectTitle = useStore(state => state.setProjectTitle);
    const setIsEditingTitle = useStore(state => state.setIsEditingTitle);
    const setActiveProjectData = useStore(state => state.setActiveProjectData);
    const setSimpleMode = useStore(state => state.setSimpleMode);
    const openModal = useStore(state => state.openModal);
    const setActiveProjectId = useStore(state => state.setActiveProjectId);
    const exportHtml = useStore(state => state.exportHtml);

    const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState(false);
    const displayMenuContainerRef = useRef(null);
    
    // Mobile Menu State
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuRef = useRef(null);
    
    const isMac = React.useMemo(() => navigator.platform.toUpperCase().indexOf('MAC') >= 0, []);
    const modifierKeyText = isMac ? '⌘Cmd' : 'Ctrl';

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (displayMenuContainerRef.current && !displayMenuContainerRef.current.contains(event.target)) {
                setIsDisplayMenuOpen(false);
            }
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (activeProjectData) {
            setProjectTitle(activeProjectData.name);
        }
    }, [activeProjectData, setProjectTitle]);

    const handleTitleSave = () => {
        if (projectTitle.trim() && activeProjectData && projectTitle !== activeProjectData.name) {
            setActiveProjectData(d => ({ ...d, name: projectTitle.trim(), lastModified: new Date().toISOString() }));
        } else if (activeProjectData) {
            setProjectTitle(activeProjectData.name);
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e) => {
        if (e.key === 'Escape') { 
            if (activeProjectData) {
                setProjectTitle(activeProjectData.name); 
            }
            setIsEditingTitle(false); 
        }
    };

    // Mobile specific handlers
    const handleExportTxt = () => {
        if (!activeProjectData) return;
        const textContent = activeProjectData.novelContent.map(chunk => chunk.text).join('\n\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([textContent], { type: 'text/plain;charset=utf-8' }));
        link.download = `${activeProjectData.name}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    if (!activeProjectData) return null;

    const titleAlignmentClass = isMobile ? 'justify-center' : 'justify-start';

    return (
        <div className="p-4 sm:p-6 border-b border-gray-700/50 flex justify-between items-center gap-2 sm:gap-4 flex-shrink-0 relative">
             {!isMobile && (
                 <Tooltip helpId="sidebar_left" placement="right">
                    <button onClick={() => setIsLeftSidebarOpen(p => !p)} className="p-2 rounded-full text-gray-300 hover:bg-gray-300 hover:text-gray-800 transition btn-pressable">{isLeftSidebarOpen ? <Icons.PanelLeftCloseIcon className="h-5 w-5" /> : <Icons.PanelLeftIcon className="h-5 w-5" />}</button>
                 </Tooltip>
             )}

             {isMobile && (
                <button onClick={() => setIsLeftSidebarOpen(true)} className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition btn-pressable">
                    <Icons.PanelLeftIcon className="h-6 w-6" />
                </button>
             )}
             
            <div className={`flex-grow min-w-0 flex ${titleAlignmentClass} items-center`}>
                 {isEditingTitle ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleTitleSave(); }} className={`flex items-center w-full justify-center`}>
                        <Icons.BookIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mr-2" />
                        <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} onBlur={handleTitleSave} onKeyDown={handleTitleKeyDown} className="text-lg font-bold bg-gray-800 border border-gray-600 rounded-md px-2 py-1 w-full max-w-[200px] text-white" autoFocus />
                    </form>
                ) : (
                    <div 
                        className={`flex items-center min-w-0 max-w-full cursor-pointer group`} 
                        onClick={() => setIsEditingTitle(true)}
                    >
                        <Icons.BookIcon className="h-6 w-6 text-gray-400 flex-shrink-0 mr-2" />
                        <h2 className="text-lg sm:text-2xl font-bold text-gray-200 truncate min-w-0">
                            {activeProjectData?.name || '生成された物語'}
                        </h2>
                        <Icons.EditIcon className={`ml-2 h-5 w-5 text-gray-500 flex-shrink-0 ${!isMobile ? 'opacity-0 group-hover:opacity-100 transition-opacity' : 'hidden'}`} />
                        {isMobile && <Icons.EditIcon className="ml-2 h-4 w-4 text-gray-500 flex-shrink-0" />}
                    </div>
                )}
                 {!isMobile && (
                    <Tooltip helpId="general_help" placement="bottom">
                        <button onClick={() => openModal('generalHelp')} className="ml-4 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition btn-pressable flex-shrink-0">
                            <Icons.HelpCircleIcon className="h-6 w-6" />
                        </button>
                    </Tooltip>
                 )}
            </div>

            {isMobile ? (
                <div className="flex items-center gap-1">
                    {/* Mobile Menu (Bento) */}
                    <div className="relative flex-shrink-0" ref={mobileMenuRef}>
                        <button 
                            id="tutorial-mobile-menu-btn"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition btn-pressable"
                        >
                            <Icons.BentoMenuIcon className="h-6 w-6" />
                        </button>
                        {isMobileMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                                 <button onClick={() => { setActiveProjectId(null); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition border-b border-gray-700">
                                    <Icons.ArrowLeftIcon className="h-4 w-4" />
                                    <span>プロジェクト一覧へ</span>
                                </button>
                                 <button onClick={() => { openModal('globalSearch'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition">
                                    <Icons.SearchIcon className="h-4 w-4" />
                                    <span>検索</span>
                                </button>
                                 <button onClick={() => { openModal('displaySettings'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition">
                                    <Icons.TextSettingsIcon className="h-4 w-4" />
                                    <span>表示設定</span>
                                </button>
                                <button onClick={() => { openModal('preview'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition">
                                    <Icons.EyeIcon className="h-4 w-4" />
                                    <span>プレビュー</span>
                                </button>
                                 <button onClick={() => { openModal('generalHelp'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white hover:bg-gray-700 transition border-t border-gray-700">
                                    <Icons.HelpCircleIcon className="h-4 w-4" />
                                    <span>ヘルプ</span>
                                </button>
                                 <div className="border-t border-gray-700">
                                     <div className="px-4 py-2 text-xs text-gray-500 font-semibold">書き出し</div>
                                     <button onClick={() => { handleExportTxt(); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition">
                                        <Icons.FileTextIcon className="h-4 w-4" />
                                        <span>テキスト (.txt)</span>
                                    </button>
                                    <button onClick={() => { openModal('htmlExport'); setIsMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition">
                                        <Icons.ImageIcon className="h-4 w-4" />
                                        <span>HTML (.html)</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setIsRightSidebarOpen(true)} className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition btn-pressable">
                        <Icons.BotIcon className="h-6 w-6" />
                    </button>
                </div>
            ) : (
                // Desktop Menu
                <div className="flex gap-2 flex-shrink-0 items-center">
                    <Tooltip helpId="search" placement="bottom">
                        <button onClick={() => openModal('globalSearch')} className="flex items-center gap-2 px-3 py-1 rounded-md text-sm btn-pressable btn-invert-gray-700">
                            <Icons.SearchIcon className="h-4 w-4" />
                            <span className="hide-on-small">検索</span>
                        </button>
                    </Tooltip>
                    
                    <div className="relative" ref={displayMenuContainerRef}>
                        <button
                            ref={displayMenuButtonRef}
                            onClick={() => setIsDisplayMenuOpen(p => !p)}
                            className="flex items-center gap-2 px-3 py-1 rounded-md text-sm btn-pressable btn-invert-gray-700"
                        >
                            <Icons.EyeIcon className="h-4 w-4" />
                            <span className="hide-on-small">表示</span>
                            <Icons.ChevronDownIcon className={`h-4 w-4 transition-transform ${isDisplayMenuOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDisplayMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-md shadow-lg z-20">
                                <button
                                    onClick={() => { openModal('displaySettings'); setIsDisplayMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-white hover:bg-gray-600 transition btn-pressable"
                                >
                                    <Icons.TextSettingsIcon className="h-4 w-4" />
                                    <span>表示設定</span>
                                </button>
                                <button
                                    onClick={() => { openModal('preview'); setIsDisplayMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-white hover:bg-gray-600 transition btn-pressable"
                                >
                                    <Icons.EyeIcon className="h-4 w-4" />
                                    <span>プレビュー</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {isSimpleMode ? (
                        <button onClick={() => setSimpleMode(false)} className="flex items-center gap-2 px-3 py-1 rounded-md text-sm btn-pressable btn-invert-indigo">
                            <Icons.LayersIcon className="h-4 w-4" />
                            <span className="hide-on-small">標準モードへ</span>
                        </button>
                    ) : (
                        <button onClick={() => setSimpleMode(true)} className="flex items-center gap-2 px-3 py-1 rounded-md text-sm btn-pressable btn-invert-gray-700">
                            <Icons.PenSquareIcon className="h-4 w-4" />
                            <span className="hide-on-small">シンプルモードへ</span>
                        </button>
                    )}
                    
                     <Tooltip helpId="sidebar_right" placement="left">
                        <button onClick={() => setIsRightSidebarOpen(p => !p)} className="p-2 rounded-full text-gray-300 hover:bg-gray-300 hover:text-gray-800 transition btn-pressable">{isRightSidebarOpen ? <Icons.PanelRightCloseIcon className="h-5 w-5" /> : <Icons.PanelRightIcon className="h-5 w-5" />}</button>
                     </Tooltip>
                </div>
            )}
        </div>
    );
};
