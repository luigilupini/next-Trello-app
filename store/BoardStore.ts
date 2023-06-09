import { create } from 'zustand';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupByColumn';
import { database, storage } from '@/appwrite';

interface BoardState {
    board: Board;
    getBoard: () => void;
    setBoard: (board: Board) => void;
    updateTodoDB: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    deleteTodo: (taskIndex: number, todo: Todo, id: TypedColumn) => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
    // The initial state of the store
    board: {
        // This needs to have the same structure as the "Board" interface
        // For the "columns" property, we need to create a new Map object
        // It has a key of "TypedColumn" and a value of "Column" type :)
        columns: new Map<TypedColumn, Column>(),
    },
    searchString: '',

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
    setSearchString: (searchString) => set({ searchString }),
    deleteTodo: async (taskIndex, todo, id) => {
        const getBoard = get().board;
        const newColumns = new Map(getBoard.columns);
        // We changing existing state in a new object (avoiding mutation)
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        set({ board: { columns: newColumns } });

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
        }
        await database.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id
        );
    },
}));

export default useBoardStore;
