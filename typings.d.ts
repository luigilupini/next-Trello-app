interface Board {
    columns: Map<TypedColumn, Column>;
}

type TypedColumn = 'todo' | 'inprogress' | 'done';

interface Column {
    id: TypedColumn;
    todos: Todo[];
}

// The structure here is based on the API response from "appwrite"
// `?` means the property is optional (may or may not exist)

interface Todo extends Models.Document {
    $id: string;
    $createdAt: string;
    title: string;
    status: TypedColumn;
    image?: Image;
}

interface Image {
    bucketId: string;
    fileId: string;
}
