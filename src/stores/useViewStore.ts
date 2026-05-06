// Navigation State for All 4 Features
import { create } from 'zustand';
import type { MuseumView, ViewState } from '../types';

interface ViewStore {
  // State
  view: ViewState;
  
  // Modals
  timeMachineOpen: boolean;
  selectedQuoteId: string | null;
  
  // Actions
  navigateTo: (view: MuseumView) => void;
  goBack: () => void;
  
  // Modal actions
  openTimeMachine: (quoteId: string) => void;
  closeTimeMachine: () => void;
  
  // Computed
  currentView: () => MuseumView;
}

const VIEW_ORDER: MuseumView[] = ['museum', 'live', 'tokens', 'conversations', 'timeline'];

export const useViewStore = create<ViewStore>((set, get) => ({
  // Initial state
  view: {
    current: 'museum',
    previous: 'museum',
    transitionDirection: 'none'
  },
  timeMachineOpen: false,
  selectedQuoteId: null,
  
  // Navigation
  navigateTo: (newView) => {
    const { view } = get();
    const currentIndex = VIEW_ORDER.indexOf(view.current);
    const newIndex = VIEW_ORDER.indexOf(newView);
    
    set({
      view: {
        current: newView,
        previous: view.current,
        transitionDirection: newIndex > currentIndex ? 'right' : 'left'
      }
    });
  },
  
  goBack: () => {
    const { view } = get();
    set({
      view: {
        current: view.previous,
        previous: view.current,
        transitionDirection: 'left'
      }
    });
  },
  
  // Modal actions
  openTimeMachine: (quoteId) => set({
    timeMachineOpen: true,
    selectedQuoteId: quoteId
  }),
  
  closeTimeMachine: () => set({
    timeMachineOpen: false,
    selectedQuoteId: null
  }),
  
  // Computed
  currentView: () => get().view.current
}));
