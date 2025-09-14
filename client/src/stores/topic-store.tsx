// Store to manage the current topic using Zustand

import { create } from 'zustand';

type Topic = {
  id: number;
  name: string;
};

type TopicState = {
  currentTopic: Topic | null;
  setCurrentTopic: (topic: Topic) => void;
  clearTopic: () => void;
};

export const useTopicStore = create<TopicState>((set) => ({
  currentTopic: null,
  setCurrentTopic: (topic) => set({ currentTopic: topic }),
  clearTopic: () => set({ currentTopic: null }),
}));
