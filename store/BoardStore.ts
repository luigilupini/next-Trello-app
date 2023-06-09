import { create } from "zustand";
import { getTodosGroupedByColumn } from "@/libs/getTodosGroupByColumn";
import { database } from "@/appwrite";

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoard: (board: Board) => void;
    updateTodoDB: (todo: Todo, columnId: TypedColumn) => void;
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
    setBoard: (board) => set({ board }),
    updateTodoDB: async (todo, columnId) => {
        await database.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            // We need to pass in the update required
            { title: todo.title, status: columnId }
        );
    },
}));

export default useBoardStore;