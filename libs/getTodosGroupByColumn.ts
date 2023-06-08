import { database } from "@/appwrite"

export const getTodosGroupedByColumn = async () => {
    const data = await database.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
    )
    // Here is the raw response from the API
    // console.log(data)

    // See `typings.d.ts` structure of the "Todo" interface that extends "Models.Document"
    // Now the Todo type has additional fields/properties like "$id", "$createdAt", etc. :)
    const todos = data.documents

    // Here we going to transform the data into a new Map object ⭐️
    // Here we want to map through the list and group status "todo", "inprogress", and "done" together.
    const columns = todos.reduce((acc, todo) => {
        // If no status for todo in `todos` then return an initial value of an empty array
        if (!acc.get(todo.status)) {
            acc.set(todo.status, {
                id: todo.status,
                todos: []
            })
        }
        // Next iteration we get the status of the todo in iteration and push it into the array
        // We add values depending on the type defined by the interface in our typings.d.ts file
        acc.get(todo.status)!.todos.push({
            $id: todo.$id,
            $createdAt: todo.$createdAt,
            title: todo.title,
            status: todo.status,
            // Here we spread only if condition `todo.image` is true
            // When we push an image into the database it needs to be a stringified to a JSON value
            // But here when we pull it needs to be parsed from JSON into a JS object
            ...(todo.image && { image: JSON.parse(todo.image) })
        })

        return acc
    }, new Map<TypedColumn, Column>())

    // Here is the result of the grouped "Mapped" together by status 🥰
    // console.log(columns)

    // If column does not yet exist for 'todo' | 'inprogress' | 'done' we need a empty placeholder!
    // So the condition below checks if there is no columns with TypedColumn then we create a new an empty placeholder
    // The columnTypes is used to define the order of the columns
    const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done']
    // console.log(columnTypes)
    for (const columnType of columnTypes) {
        // If no columnType is found then we create a new empty placeholder
        if (!columns.get(columnType)) {
            columns.set(columnType, {
                id: columnType,
                todos: []
            })
        }
    }

    // Next we need to define a new Map object that is in the correct sorted order.
    // We return an Array to this new Map object and sort it!
    // The a and b params in a `sort` represent the two items we iterate and condition against.
    // If the above fetched order of `todos` data from the API is unsorted, we sort it here!
    const sortedColumns = new Map(
        Array.from(columns.entries()).sort((a, b) => (
            // Here we check if the first item is less than the second item by array index
            columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
        ))
    )

    // Lastly we define the entire board object with the sorted columns of Board type
    const board: Board = {
        columns: sortedColumns
    }
    // console.log(board)
    return board
}