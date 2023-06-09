function formatTodosForAI(board: Board) {
    // This function will take the Map object and convert it into an Array of objects
    const todos = Array.from(board.columns.entries());

    // Reduce it down into a flatten array
    const flatArray = todos.reduce((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {} as { [key in TypedColumn]: Todo[] });
    console.log('Working on data: : ', flatArray);

    // Then we count the number of todos in each column
    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = value.length;
            return map;
        },
        {} as { [key in TypedColumn]: number }
    );
    console.log('Working on data: : ', flatArrayCounted);

    return flatArrayCounted;
}

const getSuggestion = async (board: Board) => {
    const todos = formatTodosForAI(board);
    console.log('FORMATTED TODOS TO SEND: ', todos);

    const response = await fetch('/api/generateSummary', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todos }),
    });

    const GPTData = await response.json();
    const { content } = GPTData;
    return content;
};

export default getSuggestion;
