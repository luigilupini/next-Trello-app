import { create } from 'zustand';
import { getTodosGroupedByColumn } from '@/libs/getTodosGroupByColumn';
import { ID, database, storage } from '@/appwrite';
import uploadImage from '@/libs/uploadImage';

interface BoardState {
    board: Board;
    searchString: string;
    newTaskInput: string;
    newTaskType: TypedColumn;
    image: File | null;

    getBoard: () => void;
    setBoard: (board: Board) => void;
    setSearchString: (searchString: string) => void;
    setNewTaskInput: (input: string) => void;
    setNewTaskType: (columnId: TypedColumn) => void;
    setImage: (image: File | null) => void;

    addTodo: (todo: string, columnId: TypedColumn, image?: File | null) => void;
    updateTodoDB: (todo: Todo, columnId: TypedColumn) => void;
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
    newTaskType: 'todo',
    newTaskInput: '',
    image: null,
    searchString: '',

    // The function "actions" that updates the store
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({ board }); // Expects a `board` object back from `getTodosGroupedByColumn`
    },
    setBoard: (board) => set({ board }),
    setSearchString: (searchString) => set({ searchString }),
    setNewTaskInput: (input) => set({ newTaskInput: input }),
    setNewTaskType: (columnId) => set({ newTaskType: columnId }),
    setImage: (image) => set({ image }),

    updateTodoDB: async (todo, columnId) => {
        await database.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id,
            // We need to pass in the update required
            { title: todo.title, status: columnId }
        );
    },
    deleteTodo: async (taskIndex, todo, id) => {
        const getBoard = get().board;
        const newColumns = new Map(getBoard.columns);
        // We are changing existing state in a new object (avoiding mutation)
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

    addTodo: async (todo, columnId, image?) => {
        let file: Image | undefined;

        if (image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                };
            }
        }

        const { $id } = await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),
            {
                title: todo,
                status: columnId,
                // include image if it exists
                ...(file && { image: JSON.stringify(file) }),
            }
        );

        set({ newTaskInput: '' });

        set((state) => {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                // include image if it exists
                ...(file && { image: file }),
            };

            const column = newColumns.get(columnId);

            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo],
                });
            } else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }

            return {
                board: {
                    columns: newColumns,
                },
            };
        });
    },
}));

export default useBoardStore;
