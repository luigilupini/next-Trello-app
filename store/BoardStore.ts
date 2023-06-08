import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/libs/getTodosGroupByColumn";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
}

const useBoardStore = create<BoardState>((set) => ({
    // The initial state of the store
    board: {
        // This needs to have the same structure as the "Board" interface
        // For the "columns" property, we need to create a new Map object
        // It has a key of "TypedColumn" and a value of "Column" type :)
        columns: new Map<TypedColumn, Column>(),
    },
    // The function "actions" that updates the store
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board }); // Expects a `board` object back from `getTodosGroupedByColumn`
    },
    setBoardState: (board) => set({ board }),
}));

export default useBoardStore;