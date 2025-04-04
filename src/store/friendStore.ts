import { create } from 'zustand';
import { Friend } from '../types';

interface FriendState {
  friends: Friend[];
  addFriend: (name: string) => void;
  removeFriend: (id: string) => void;
}

export const useFriendStore = create<FriendState>((set) => ({
  friends: [
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
    { id: '4', name: 'David' }
  ],
  addFriend: (name: string) => set((state) => ({
    friends: [...state.friends, { id: crypto.randomUUID(), name }]
  })),
  removeFriend: (id: string) => set((state) => ({
    friends: state.friends.filter(friend => friend.id !== id)
  }))
}));