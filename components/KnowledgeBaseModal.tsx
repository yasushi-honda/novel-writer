
import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from '../icons';
import { KnowledgeItem } from '../types';
import { useStore } from '../store/index';
import { KnowledgeTutorial } from './KnowledgeTutorial';

interface KnowledgeBaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    knowledgeBase: KnowledgeItem[];
    onAddItem: () => void;
    onEditItem: (item: KnowledgeItem) => void;
    onDeleteItem: (id: string) => void;
    onTogglePin: (id: string) => void;
}

export const KnowledgeBaseModal: React.FC<KnowledgeBaseModalProps> = ({
    isOpen,
    onClose,
    knowledgeBase,
    onAddItem,
    onEditItem,
    onDeleteItem,
    onTogglePin,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [deletingId, setDeletingId] = useState<string | null>(null);
    
    const hasCompletedGlobalKnowledgeTutorial = useStore(state => state.hasCompletedGlobalKnowledgeTutorial);
    const startKnowledgeTutorial = useStore(state => state.startKnowledgeTutorial);

    useEffect(() => {
        if (isOpen && !hasCompletedGlobalKnowledgeTutorial) {
            const timer = setTimeout(() => {
                startKnowledgeTutorial();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, hasCompletedGlobalKnowledgeTutorial, startKnowledgeTutorial]);

    const allTags = useMemo(() => {
        const tags = new Set<string>();
        knowledgeBase.forEach(item => {
            // Defensive check: ensure tags is an array before iterating
            if (Array.isArray(item.tags)) {
                item.tags.forEach(tag => {
                    if (typeof tag === 'string' && tag.trim()) {
                        tags.add(tag.trim());
                    }
                });
            }
        });
        return Array.from(tags).sort();
    }, [knowledgeBase]);

    useEffect(() => {
        if (isOpen) {
            // When opening, find all categories and set them to expanded by default.
            // Also, find newly added categories that weren't there before and expand them.
            const newExpanded: Record<string, boolean> = {};
            const allCategories = new Set(knowledgeBase.map(k => k.category || '未分類'));
            allCategories.forEach((cat: string) => {
                // If it's a new category or was previously expanded (or doesn't exist in old state), expand it.
                if (expandedCategories[cat] !== false) {
                    newExpanded[cat] = true;
                }
            });
            setExpandedCategories(newExpanded);
            setDeletingId(null);
        }
    }, [isOpen, knowledgeBase]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const filteredAndSortedKnowledge = useMemo(() => {
        let filtered = [...knowledgeBase];

        // 1. Filter by selected tags (AND logic)
        if (selectedTags.length > 0) {
            filtered = filtered.filter(item =>
                selectedTags.every(tag => Array.isArray(item.tags) && item.tags.includes(tag))
            );
        }

        // 2. Filter by search term
        const term = searchTerm.toLowerCase();
        if (term) {
            filtered = filtered.filter(
                k =>
                    k.name.toLowerCase().includes(term) ||
                    k.content.toLowerCase().includes(term) ||
                    (k.category || '').toLowerCase().includes(term) ||
                    (Array.isArray(k.tags) && k.tags.some(t => t.toLowerCase().includes(term)))
            );
        }
        
        // 3. Sort by pin status then by name
        filtered.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return a.name.localeCompare(b.name, 'ja');
        });

        return filtered;
    }, [knowledgeBase, searchTerm, selectedTags]);

    const groupedByCategory = useMemo(() => {
        const groups = filteredAndSortedKnowledge.reduce((acc, item) => {
            const category = item.category || '未分類';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(item);
            return acc;
        }, {} as Record<string, KnowledgeItem[]>);

        return Object.entries(groups).sort((a, b) => {
            const catA = a[0];
            const catB = b[0];
            if (catA === '未分類') return 1;
            if (catB === '未分類') return -1;
            return catA.localeCompare(catB, 'ja');
        });
    }, [filteredAndSortedKnowledge]);
    
    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[70]">
            <KnowledgeTutorial />
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl p-6 border border-gray-700 max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                        <Icons.LibraryIcon className="h-6 w-6" />
                        ナレッジベース
                    </h2>
                    <div className="flex items-center gap-2">
                        <button id="tutorial-kb-add-btn" onClick={onAddItem} className="flex items-center gap-2 px-4 py-2 text-sm bg-yellow-600/80 text-white rounded-md hover:bg-yellow-600 transition btn-pressable">
                            <Icons.PlusCircleIcon />
                            新規項目を追加
                        </button>
                         <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition"><Icons.XIcon /></button>
                    </div>
                </div>
                
                <div className="flex gap-4 mb-4 flex-shrink-0">
                    <div id="tutorial-kb-search" className="relative flex-grow">
                        <Icons.SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="ナレッジを検索..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-md pl-10 pr-4 py-2 text-sm text-white"
                        />
                    </div>
                </div>
                
                <div id="tutorial-kb-tags" className="mb-4 flex-shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-400">タグ:</span>
                        {allTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagClick(tag)}
                                className={`px-2.5 py-1 text-xs rounded-full transition ${selectedTags.includes(tag) ? 'bg-indigo-600 text-white font-semibold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                {tag}
                            </button>
                        ))}
                         {selectedTags.length > 0 && (
                            <button onClick={() => setSelectedTags([])} className="text-xs text-gray-400 hover:text-white">
                                <Icons.XIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div id="tutorial-kb-item-list" className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-4">
                    {groupedByCategory.length > 0 ? (
                        groupedByCategory.map(([category, items]) => (
                            <div key={category}>
                                <button onClick={() => toggleCategory(category)} className="w-full flex items-center gap-2 text-left text-lg font-semibold text-gray-300 mb-2">
                                    {expandedCategories[category] ? <Icons.ChevronDownIcon className="h-5 w-5" /> : <Icons.ChevronRightIcon className="h-5 w-5" />}
                                    <span>{category}</span>
                                    <span className="text-sm font-normal text-gray-500">({items.length})</span>
                                </button>
                                {expandedCategories[category] && (
                                    <div className="space-y-2 pl-4">
                                        {items.map(item => (
                                            <div key={item.id} className={`p-3 rounded-lg flex gap-2 ${item.isPinned ? 'bg-yellow-800/20' : 'bg-gray-900/50'} ${deletingId === item.id ? 'border border-red-500 bg-red-900/20' : ''}`}>
                                                <div className="flex-grow overflow-hidden">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`font-bold truncate ${item.isPinned ? 'text-yellow-300' : 'text-yellow-400'}`}>{item.name}</p>
                                                        <div className="flex gap-2 flex-shrink-0 ml-2">
                                                            {deletingId === item.id ? (
                                                                <div className="flex items-center gap-2 animate-fade-in">
                                                                    <span className="text-xs text-red-300 font-bold mr-1">削除?</span>
                                                                    <button onClick={() => { onDeleteItem(item.id); setDeletingId(null); }} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded shadow-md">はい</button>
                                                                    <button onClick={() => setDeletingId(null)} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded shadow-md">いいえ</button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => onTogglePin(item.id)} className={`p-1 rounded-full ${item.isPinned ? 'text-yellow-400' : 'text-gray-400'} hover:bg-yellow-500/20`} title={item.isPinned ? 'ピンを外す' : 'ピン留めする'}>
                                                                        <Icons.PinIcon className={`h-4 w-4 ${item.isPinned ? 'fill-current' : ''}`} />
                                                                    </button>
                                                                    <button onClick={() => onEditItem(item)} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" title="編集">
                                                                        <Icons.EditIcon className="h-4 w-4" />
                                                                    </button>
                                                                    <button onClick={() => setDeletingId(item.id)} className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white" title="削除">
                                                                        <Icons.TrashIcon className="h-4 w-4" />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">{item.content}</p>
                                                    <div className="flex flex-wrap gap-1 mt-2">
                                                        {item.tags?.map(tag => (
                                                            <span key={tag} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">
                            {searchTerm || selectedTags.length > 0 ? '条件に一致する項目はありません。' : 'ナレッジ項目がありません。'}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
