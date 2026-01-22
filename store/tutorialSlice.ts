

const initialState = {
    isTutorialActive: false,
    tutorialStep: 0,
    isKnowledgeTutorialActive: false,
    knowledgeTutorialStep: 0,
    isChartTutorialActive: false,
    chartTutorialStep: 0,
    isPlotBoardTutorialActive: false,
    plotBoardTutorialStep: 0,
    isTimelineTutorialActive: false,
    timelineTutorialStep: 0,
    hasCompletedGlobalTutorial: false,
    hasCompletedGlobalKnowledgeTutorial: false,
    hasCompletedGlobalChartTutorial: false,
    hasCompletedGlobalPlotBoardTutorial: false,
    hasCompletedGlobalTimelineTutorial: false,
};

export interface TutorialSlice {
    isTutorialActive: boolean;
    tutorialStep: number;
    isKnowledgeTutorialActive: boolean;
    knowledgeTutorialStep: number;
    isChartTutorialActive: boolean;
    chartTutorialStep: number;
    isPlotBoardTutorialActive: boolean;
    plotBoardTutorialStep: number;
    isTimelineTutorialActive: boolean;
    timelineTutorialStep: number;
    hasCompletedGlobalTutorial?: boolean;
    hasCompletedGlobalKnowledgeTutorial?: boolean;
    hasCompletedGlobalChartTutorial?: boolean;
    hasCompletedGlobalPlotBoardTutorial?: boolean;
    hasCompletedGlobalTimelineTutorial?: boolean;

    startTutorial: () => void;
    nextTutorialStep: () => void;
    prevTutorialStep: () => void;
    endTutorial: () => void;
    setTutorialStep: (step: number) => void;
    startKnowledgeTutorial: () => void;
    nextKnowledgeTutorialStep: () => void;
    endKnowledgeTutorial: () => void;
    setKnowledgeTutorialStep: (step: number) => void;
    startChartTutorial: () => void;
    nextChartTutorialStep: () => void;
    endChartTutorial: () => void;
    setChartTutorialStep: (step: number) => void;
    startPlotBoardTutorial: () => void;
    nextPlotBoardTutorialStep: () => void;
    endPlotBoardTutorial: () => void;
    setPlotBoardTutorialStep: (step: number) => void;
    startTimelineTutorial: () => void;
    nextTimelineTutorialStep: () => void;
    endTimelineTutorial: () => void;
    setTimelineTutorialStep: (step: number) => void;
}

export const createTutorialSlice = (set, get): TutorialSlice => ({
    ...initialState,
    startTutorial: () => set({ isTutorialActive: true, tutorialStep: 0 }),
    nextTutorialStep: () => set(state => ({ tutorialStep: state.tutorialStep + 1 })),
    prevTutorialStep: () => set(state => ({ tutorialStep: Math.max(0, state.tutorialStep - 1) })),
    setTutorialStep: (step) => set({ tutorialStep: step }),
    endTutorial: () => {
        set({ isTutorialActive: false, tutorialStep: 0, hasCompletedGlobalTutorial: true });
    },

    startKnowledgeTutorial: () => set({ isKnowledgeTutorialActive: true, knowledgeTutorialStep: 0 }),
    nextKnowledgeTutorialStep: () => set(state => ({ knowledgeTutorialStep: state.knowledgeTutorialStep + 1 })),
    setKnowledgeTutorialStep: (step) => set({ knowledgeTutorialStep: step }),
    endKnowledgeTutorial: () => {
        set({ isKnowledgeTutorialActive: false, knowledgeTutorialStep: 0, hasCompletedGlobalKnowledgeTutorial: true });
    },

    startChartTutorial: () => set({ isChartTutorialActive: true, chartTutorialStep: 0 }),
    nextChartTutorialStep: () => set(state => ({ chartTutorialStep: state.chartTutorialStep + 1 })),
    setChartTutorialStep: (step) => set({ chartTutorialStep: step }),
    endChartTutorial: () => {
        set({ isChartTutorialActive: false, chartTutorialStep: 0, hasCompletedGlobalChartTutorial: true });
    },

    startPlotBoardTutorial: () => set({ isPlotBoardTutorialActive: true, plotBoardTutorialStep: 0 }),
    nextPlotBoardTutorialStep: () => set(state => ({ plotBoardTutorialStep: state.plotBoardTutorialStep + 1 })),
    setPlotBoardTutorialStep: (step) => set({ plotBoardTutorialStep: step }),
    endPlotBoardTutorial: () => {
        set({ isPlotBoardTutorialActive: false, plotBoardTutorialStep: 0, hasCompletedGlobalPlotBoardTutorial: true });
    },

    startTimelineTutorial: () => set({ isTimelineTutorialActive: true, timelineTutorialStep: 0 }),
    nextTimelineTutorialStep: () => set(state => ({ timelineTutorialStep: state.timelineTutorialStep + 1 })),
    setTimelineTutorialStep: (step) => set({ timelineTutorialStep: step }),
    endTimelineTutorial: () => {
        set({ isTimelineTutorialActive: false, timelineTutorialStep: 0, hasCompletedGlobalTimelineTutorial: true });
    },
});