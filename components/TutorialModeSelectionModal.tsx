
import React from 'react';
import { createPortal } from 'react-dom';
import * as Icons from '../icons';
import { useStore } from '../store/index';

export const TutorialModeSelectionModal = () => {
    const { activeModal, closeModal, startTutorial, endTutorial } = useStore(state => ({
        activeModal: state.activeModal,
        closeModal: state.closeModal,
        startTutorial: state.startTutorial,
        endTutorial: state.endTutorial,
    }));

    const isOpen = activeModal === 'tutorialModeSelection';

    const handleSelect = (action: 'start' | 'skip') => {
        if (action === 'start') {
            startTutorial();
        } else {
            endTutorial(); // Mark tutorial as completed
        }
        closeModal();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-[9998]">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-8 border border-indigo-500/50">
                <div className="text-center">
                    <Icons.BotIcon className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">小説らいたーへようこそ！</h2>
                    <p className="text-gray-400 mb-8">最初に、アプリの基本的な使い方を学びますか？</p>
                </div>
                
                <div className="space-y-4">
                    <button
                        onClick={() => handleSelect('start')}
                        className="w-full text-left p-4 bg-indigo-600/80 hover:bg-indigo-600 rounded-lg transition-all transform hover:scale-105 btn-pressable flex items-center gap-4"
                    >
                        <Icons.LightbulbIcon className="h-8 w-8 text-yellow-300 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white">超初心者モード (チュートリアルを開始)</h3>
                            <p className="text-sm text-indigo-200">基本的な使い方を一緒に確認しましょう！(おすすめです)</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect('start')}
                        className="w-full text-left p-4 bg-gray-700/80 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105 btn-pressable flex items-center gap-4"
                    >
                         <Icons.BookIcon className="h-8 w-8 text-gray-300 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white">中級モード (チュートリアルを開始)</h3>
                            <p className="text-sm text-gray-400">一通り機能を確認したい方向けです。</p>
                        </div>
                    </button>
                    
                    <button
                        onClick={() => handleSelect('skip')}
                        className="w-full text-left p-4 bg-gray-700/80 hover:bg-gray-700 rounded-lg transition-all transform hover:scale-105 btn-pressable flex items-center gap-4"
                    >
                         <Icons.UserCogIcon className="h-8 w-8 text-gray-300 flex-shrink-0" />
                        <div>
                            <h3 className="font-bold text-white">説明書を読んだことがある人 (スキップ)</h3>
                            <p className="text-sm text-gray-400">後からヘルプメニューでいつでも確認できます。</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
