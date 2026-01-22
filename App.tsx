import React, { useEffect, useRef, useState } from 'react';
import { Tutorial } from './components/Tutorial';
import { ResizableHandle } from './components/ResizableHandle';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { ActivityBar } from './components/ActivityBar';
import { NovelEditor } from './components/NovelEditor';
import { RightPanel } from './components/RightPanel';
import { ModalManager } from './components/ModalManager';
import { CommandPalette } from './components/CommandPalette';
import { FloatingWindow } from './components/FloatingWindow';
import { useStore } from './store/index';
import { useKeybindings } from './hooks/useKeybindings';
import { useSidebarResize } from './hooks/useSidebarResize';
import { ProjectSelectionScreen } from './components/ProjectSelectionScreen';
import { Toast } from './components/Toast';
import { TutorialModeSelectionModal } from './components/TutorialModeSelectionModal';
import AppMobile from './App.mobile';

export default function App() {
    // --- Zustand Store Selectors ---
    const activeProjectId = useStore(state => state.activeProjectId);
    const allProjectsData = useStore(state => state.allProjectsData);
    const isLeftSidebarOpen = useStore(state => state.isLeftSidebarOpen);
    const isRightSidebarOpen = useStore(state => state.isRightSidebarOpen);
    const leftSidebarWidth = useStore(state => state.leftSidebarWidth);
    const rightSidebarWidth = useStore(state => state.rightSidebarWidth);
    const hasCompletedGlobalTutorial = useStore(state => state.hasCompletedGlobalTutorial);
    const floatingWindows = useStore(state => state.floatingWindows);
    const activeModal = useStore(state => state.activeModal);
    const editingChunkId = useStore(state => state.editingChunkId);
    const generationMode = useStore(state => state.generationMode);
    const novelContent = useStore(state => activeProjectId ? state.allProjectsData[activeProjectId]?.novelContent : []);

    const createProject = useStore(state => state.createProject);
    const deleteProject = useStore(state => state.deleteProject);
    const importProject = useStore(state => state.importProject);
    const setActiveProjectId = useStore(state => state.setActiveProjectId);
    const setLeftSidebarWidth = useStore(state => state.setLeftSidebarWidth);
    const setRightSidebarWidth = useStore(state => state.setRightSidebarWidth);
    const openModal = useStore(state => state.openModal);
    const setIsLeftSidebarOpen = useStore(state => state.setIsLeftSidebarOpen);
    const setIsRightSidebarOpen = useStore(state => state.setIsRightSidebarOpen);
    const setGenerationMode = useStore(state => state.setGenerationMode);
    const undo = useStore(state => state.undo);
    const redo = useStore(state => state.redo);
    const setEditingChunkId = useStore(state => state.setEditingChunkId);
    
    const displayMenuButtonRef = useRef(null);
    const userInputRef = useRef<HTMLTextAreaElement>(null);
    const { isResizing, handleResizeStart } = useSidebarResize(
        leftSidebarWidth,
        setLeftSidebarWidth,
        rightSidebarWidth,
        setRightSidebarWidth,
    );
    
    const activeProjectData = activeProjectId ? allProjectsData[activeProjectId] : null;
    const displaySettings = activeProjectData?.displaySettings;
    const isSwapped = displaySettings?.swapSidebars ?? false;

    // Mobile Detection with Threshold Stability
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            const width = window.innerWidth;
            // 768px付近でのチャタリング（リサイズによる頻繁な切り替わり）を防ぐため判定を工夫
            setIsMobile(prev => {
                if (prev) return width < 800; // 一度モバイルになったら800pxまでモバイル維持
                return width < 768; // デスクトップからは768px未満で切り替え
            });
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    
    useKeybindings({
        isAnyModalOpen: activeModal !== null,
        editingChunkId: editingChunkId,
        openModal: openModal,
        setIsLeftSidebarOpen: setIsLeftSidebarOpen,
        setIsRightSidebarOpen: setIsRightSidebarOpen,
        userInputRef: userInputRef,
        generationMode: generationMode,
        setGenerationMode: setGenerationMode,
        undo: undo,
        redo: redo,
        novelContent: novelContent,
        setEditingChunkId: setEditingChunkId
    });

    useEffect(() => {
        if (activeProjectData && !hasCompletedGlobalTutorial && !activeProjectData.isSimpleMode) {
            const timer = setTimeout(() => openModal('tutorialModeSelection'), 500);
            return () => clearTimeout(timer);
        }
    }, [activeProjectData, hasCompletedGlobalTutorial, openModal]);

    // Handle knowledge link clicks globally
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            const target = (event.target as HTMLElement).closest('.knowledge-link');
            if (target) {
                event.preventDefault();
                const knowledgeId = target.getAttribute('data-knowledge-id');
                if (knowledgeId) {
                    const knowledgeBase = useStore.getState().allProjectsData[useStore.getState().activeProjectId || '']?.knowledgeBase || [];
                    const item = knowledgeBase.find(k => k.id === knowledgeId);
                    if (item) openModal('knowledge', item);
                }
            }
        };
        const rootElement = document.getElementById('root');
        if (rootElement) rootElement.addEventListener('click', handleClick);
        return () => { if (rootElement) rootElement.addEventListener('click', handleClick); };
    }, [openModal]);


    const handleExportProject = (projectId: string) => {
        const projectData = allProjectsData[projectId];
        if (!projectData) return;
        const dataStr = JSON.stringify(projectData, null, 2);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([dataStr], { type: 'application/json' }));
        link.download = `${projectData.name}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
    };
     const handleExportTxt = () => {
        if (!activeProjectData) return;
        const textContent = activeProjectData.novelContent.map(chunk => chunk.text).join('\n\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([textContent], { type: 'text/plain;charset=utf-8' }));
        link.download = `${activeProjectData.name}.txt`;
        link.click();
        URL.revokeObjectURL(link.href);
    };

    if (!activeProjectId || !activeProjectData) {
        return <ProjectSelectionScreen 
            projects={Object.values(allProjectsData)} 
            onCreateProject={createProject} 
            onDeleteProject={deleteProject} 
            onImportProject={importProject} 
            onSelectProject={setActiveProjectId} 
        />;
    }

    // Mobile View
    if (isMobile) {
        return <AppMobile />;
    }

    // Desktop View
    const spacer = !activeProjectData?.isSimpleMode ? <div className="w-14 flex-shrink-0" /> : null;
    const activityBar = !activeProjectData?.isSimpleMode ? <ActivityBar /> : null;
    
    const leftPanelArea = isLeftSidebarOpen && (
        <>
            <LeftPanel onExportProject={() => handleExportProject(activeProjectId)} onExportTxt={handleExportTxt} />
            <ResizableHandle onMouseDown={(e) => handleResizeStart('left', e)} />
        </>
    );

    const rightPanelArea = isRightSidebarOpen && (
        <>
            <ResizableHandle onMouseDown={(e) => handleResizeStart('right', e)} />
            <RightPanel userInputRef={userInputRef} />
        </>
    );

    const mainContent = (
        <div className="flex-1 flex flex-col bg-gray-900 min-w-0 min-h-0">
            <Header displayMenuButtonRef={displayMenuButtonRef} />
            <NovelEditor />
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200 overflow-hidden relative">
            <Toast />
            <Tutorial />
            <TutorialModeSelectionModal />
            <ModalManager displayMenuButtonRef={displayMenuButtonRef} isMobile={isMobile} />
            <CommandPalette />
            
            {floatingWindows.map(window => (
                <FloatingWindow key={window.id} {...window} />
            ))}

            {isSwapped ? (
                <>
                    {/* 入れ替え時: [ 右パネル | メイン | 左パネル | バー(fixed) ] */}
                    {rightPanelArea}
                    {mainContent}
                    <div className="flex h-full flex-shrink-0">
                        {leftPanelArea}
                        {spacer}
                        {activityBar}
                    </div>
                </>
            ) : (
                <>
                    {/* 通常時: [ バー(fixed) | 左パネル | メイン | 右パネル ] */}
                    <div className="flex h-full flex-shrink-0">
                        {activityBar}
                        {spacer}
                        {leftPanelArea}
                    </div>
                    {mainContent}
                    {rightPanelArea}
                </>
            )}
        </div>
    );
}