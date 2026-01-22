import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as Icons from '../icons';
import { useStore } from '../store/index';
import { EditableParagraph } from './EditableParagraph';
import { TextSelectionToolbar } from './TextSelectionToolbar';
import { NovelChunk } from '../types';
import { FONT_MAP, defaultDisplaySettings } from '../constants';
import { Tooltip } from './Tooltip';

export const NovelEditor: React.FC = () => {
    const activeProjectId = useStore(state => state.activeProjectId);
    const activeProjectData = useStore(state => state.allProjectsData[activeProjectId]);
    
    if (!activeProjectData) return null;

    const { novelContent, settings, knowledgeBase, displaySettings: projectDisplaySettings } = activeProjectData;
    const displaySettings = projectDisplaySettings || defaultDisplaySettings;

    const highlightedChunkId = useStore(state => state.highlightedChunkId);
    const editingChunkId = useStore(state => state.editingChunkId);
    const newChunkText = useStore(state => state.newChunkText);
    const isNewChunkInputOpen = useStore(state => state.isNewChunkInputOpen);

    const setEditingChunkId = useStore(state => state.setEditingChunkId);
    const handleNovelTextChange = useStore(state => state.handleNovelTextChange);
    const handleToggleChunkPin = useStore(state => state.handleToggleChunkPin);
    const setNewChunkText = useStore(state => state.setNewChunkText);
    const setIsNewChunkInputOpen = useStore(state => state.setIsNewChunkInputOpen);
    const handleAddNewChunk = useStore(state => state.handleAddNewChunk);
    const setUserInput = useStore(state => state.setUserInput);
    const setIsRightSidebarOpen = useStore(state => state.setIsRightSidebarOpen);

    const novelContentRef = useRef<HTMLDivElement>(null);
    const newChunkTextareaRef = useRef<HTMLTextAreaElement>(null);
    const isMac = useMemo(() => navigator.platform.toUpperCase().indexOf('MAC') >= 0, []);
    const modifierKeyText = isMac ? '⌘Cmd' : 'Ctrl';
    
    const [selectionToolbar, setSelectionToolbar] = useState<{ top: number; left: number } | null>(null);
    const selectionRef = useRef({ text: '', range: null });

    useEffect(() => {
        if (newChunkTextareaRef.current) {
            newChunkTextareaRef.current.style.height = 'auto';
            const scrollHeight = newChunkTextareaRef.current.scrollHeight;
            newChunkTextareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [newChunkText]);
    
    useEffect(() => {
        if (editingChunkId) {
            document.getElementById(`chunk-${editingChunkId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [editingChunkId]);
    
    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const text = selection.toString().trim();

                if (text && novelContentRef.current?.contains(range.commonAncestorContainer)) {
                    selectionRef.current = { text, range };
                    const rect = range.getBoundingClientRect();
                    const editorRect = novelContentRef.current.getBoundingClientRect();
                    setSelectionToolbar({
                        top: rect.top - editorRect.top - 40,
                        left: rect.left - editorRect.left + rect.width / 2,
                    });
                } else {
                    setSelectionToolbar(null);
                    selectionRef.current = { text: '', range: null };
                }
            }
        };

        const editorElement = novelContentRef.current;
        if (editorElement) {
            document.addEventListener('selectionchange', handleSelectionChange);
            editorElement.addEventListener('mousedown', () => setSelectionToolbar(null));
        }
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
            if (editorElement) {
                editorElement.removeEventListener('mousedown', () => setSelectionToolbar(null));
            }
        };
    }, []);

    const handleToolbarAction = (actionType: 'proofread' | 'summarize' | 'poetic' | 'dialogue') => {
        const selectedText = selectionRef.current.text;
        if (!selectedText) return;

        let prompt = '';
        switch (actionType) {
            case 'proofread':
                prompt = `以下の文章の誤字脱字や文法的な誤りを修正してください。:\n\n「${selectedText}」`;
                break;
            case 'summarize':
                prompt = `以下の文章を簡潔に要約してください。:\n\n「${selectedText}」`;
                break;
            case 'poetic':
                prompt = `以下の文章を、より詩的で感情豊かな表現に書き換えてください。:\n\n「${selectedText}」`;
                break;
            case 'dialogue':
                prompt = `以下の地の文を、キャラクターの会話文に変換してください。:\n\n「${selectedText}」`;
                break;
        }

        setUserInput(prompt);
        setIsRightSidebarOpen(true);
        setSelectionToolbar(null);
        window.getSelection()?.removeAllRanges();
    };

    const chapters = useMemo(() => {
        if (!novelContent) return [];
        const result: { id: string; title: string; memo?: string; chunks: NovelChunk[] }[] = [];
        let currentChapterChunks: NovelChunk[] = [];
    
        const extractTitleFromChunkText = (chunkText: string) => {
            if (!chunkText.startsWith('# ')) return '';
            const firstLine = chunkText.split('\n')[0];
            return firstLine.substring(2).trim();
        };
    
        novelContent.forEach((chunk) => {
            const isTitle = chunk.text.startsWith('# ');
            if (isTitle) {
                if (currentChapterChunks.length > 0) {
                    const firstChunkOfPreviousBlock = currentChapterChunks[0];
                    const isPreviousBlockTitled = firstChunkOfPreviousBlock.text.startsWith('# ');
    
                    if (isPreviousBlockTitled) {
                        result.push({ id: firstChunkOfPreviousBlock.id, title: extractTitleFromChunkText(firstChunkOfPreviousBlock.text) || '無題の章', memo: firstChunkOfPreviousBlock.memo, chunks: currentChapterChunks });
                    } else {
                        result.push({ id: firstChunkOfPreviousBlock.id, title: '章に属さない文章', chunks: currentChapterChunks });
                    }
                }
                currentChapterChunks = [chunk];
            } else {
                currentChapterChunks.push(chunk);
            }
        });
    
        if (currentChapterChunks.length > 0) {
            const firstChunk = currentChapterChunks[0];
            const isTitled = firstChunk.text.startsWith('# ');
            result.push({ id: firstChunk.id, title: isTitled ? (extractTitleFromChunkText(firstChunk.text) || '無題の章') : '章に属さない文章', memo: isTitled ? firstChunk.memo : undefined, chunks: currentChapterChunks });
        }
    
        return result;
    }, [novelContent]);

    const handleNewChunkKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            if (newChunkText.trim()) {
                handleAddNewChunk();
            }
        }
    };
    
    const themes = { light: { bg: 'bg-white', text: 'text-gray-800', prose: '' }, sepia: { bg: 'bg-[#fbf0d9]', text: 'text-[#5b4636]', prose: 'prose-sepia' }, dark: { bg: 'bg-gray-800', text: 'text-gray-200', prose: 'prose-invert' } };
    const contentStyles = { fontFamily: FONT_MAP[displaySettings.fontFamily] || FONT_MAP['sans'], fontSize: `${displaySettings.fontSize}px`, lineHeight: 1.8 };
    const proseClasses = ['prose', 'prose-lg', 'max-w-full', (themes[displaySettings.theme] || themes.light).prose].filter(Boolean).join(' ');
    const themeClass = themes[displaySettings?.theme] || themes.light;
    const newChunkInputTextColor = {
        light: 'black',
        sepia: '#555555',
        dark: '#d1d5db',
    }[displaySettings.theme] || 'black';

    return (
        <div className="flex-1 flex flex-col min-h-0 relative bg-gray-900">
            <div
                id="novel-editor-content"
                tabIndex={-1}
                ref={novelContentRef}
                className={`flex-1 p-6 pb-32 overflow-y-auto min-h-0 transition-colors duration-300 ${themeClass.bg} ${themeClass.text} focus:outline-none focus:ring-2 focus:ring-indigo-500 relative`}
                data-tutorial-id="tutorial-center-panel"
            >
                {selectionToolbar && <TextSelectionToolbar position={selectionToolbar} onAction={handleToolbarAction} />}
                <div className={proseClasses}>
                    {chapters.map(chapter => (
                        <div key={chapter.id} id={`chapter-scroll-${chapter.id}`} className="chapter-group">
                            {chapter.chunks.map(chunk => (
                                <EditableParagraph key={chunk.id} chunk={chunk} characters={settings.filter(s => s.type === 'character')} knowledgeBase={knowledgeBase} onTextChange={handleNovelTextChange} onTogglePin={handleToggleChunkPin} isHighlighted={chunk.id === highlightedChunkId} isEditing={chunk.id === editingChunkId} onStartEdit={() => setEditingChunkId(chunk.id)} onEndEdit={() => setEditingChunkId(null)} scrollContainerRef={novelContentRef} />
                            ))}
                        </div>
                    ))}
                    {novelContent.length === 0 && <p className="text-gray-500">ここに物語が生成されます...</p>}
                </div>
            </div>
            <div 
                className={`border-t border-gray-700/50 flex-shrink-0 z-10 relative shadow-[0_-4px_12px_rgba(0,0,0,0.15)] ${themeClass.bg}`}
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                <Tooltip helpId="direct_input_open">
                    <div className="group flex justify-between items-center p-2 cursor-pointer hover:bg-gray-700" onClick={() => setIsNewChunkInputOpen(p => !p)} aria-expanded={isNewChunkInputOpen} aria-controls="new-chunk-panel">
                        <h3 className="text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">本文を直接入力</h3>
                        <button className="p-1 text-gray-400 group-hover:text-white transition-colors btn-pressable" aria-label={isNewChunkInputOpen ? '入力を閉じる' : '入力を開く'}>{isNewChunkInputOpen ? <Icons.ChevronDownIcon className="h-5 w-5" /> : <Icons.ChevronUpIcon className="h-5 w-5" />}</button>
                    </div>
                </Tooltip>
                <div id="new-chunk-panel" className={`transition-all duration-300 ease-in-out overflow-hidden ${isNewChunkInputOpen ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="p-4 pt-0">
                        <textarea
                            ref={newChunkTextareaRef}
                            value={newChunkText}
                            onChange={(e) => setNewChunkText(e.target.value)}
                            onKeyDown={handleNewChunkKeyDown}
                            placeholder="ここに新しい段落を直接入力できます..."
                            className={`w-full border rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-colors duration-300`}
                            style={{ ...contentStyles, color: newChunkInputTextColor, backgroundColor: 'rgba(128, 128, 128, 0.1)' }}
                            rows={3}
                        />
                        <div className="flex justify-end mt-2"><button onClick={handleAddNewChunk} disabled={!newChunkText.trim()} className="px-4 py-2 text-sm rounded-md disabled:bg-gray-500 btn-pressable btn-invert-indigo">本文に追加 <span className="text-xs opacity-80 ml-1">({modifierKeyText}+Enterで追加)</span></button></div>
                    </div>
                </div>
            </div>
        </div>
    );
};