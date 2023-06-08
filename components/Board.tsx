'use client';

import React, { useEffect } from 'react';
import useBoardStore from '@/store/BoardStore';

import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import ColumnItem from './ColumnItem';

export default function Board() {
    const board = useBoardStore((state) => state.board);
    const getBoard = useBoardStore((state) => state.getBoard)
    const setBoardState = useBoardStore((state) => state.setBoardState)

    useEffect(() => {
        // Calling a Zustand action here getBoard to fetch the board data
        getBoard();
    }, [getBoard]);
    console.log(board)

    // This will trigger when you let go of a draggable operation
    const handleOnDragEnd = (result: DropResult) => {
        console.log(result)
        // `type` type of the draggable either 'column' or 'card'
        // `source` where you started the draggable
        // `destination` where you dropped/ended the draggable
        // `draggableId` the id of the draggable
        // `index` resembles which place it was in the list
        const { type, source, destination, draggableId } = result;

        // If the user drags outside of the board meaning any destination, exit early
        if (!destination) return;

        // Lets handle a column drag and drop operation
        if (type === 'column') {
            const newBoard = Array.from(board.columns.entries());
            const [removed] = newBoard.splice(source.index, 1);
            newBoard.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(newBoard);
            setBoardState({
                ...board,
                columns: rearrangedColumns
            })
        }

        // Lets handle the card drag and drop operation
        // This step is needed as the indexes are stored as numbers 0, 1, 2, etc instead of `id` used by the DragDropContext
        // Now we need a copy of all the current columns in the board (avoid mutation)
        const currentColumns = Array.from(board.columns);
        // Next we figure out the start & end index by using the `source` and `destination` from result parameter
        const startColumnIndex = currentColumns[Number(source.droppableId)]
        const endColumnIndex = currentColumns[Number(destination.droppableId)]
        // With these values we rebuilding the desired start & end columns with the new order of todos
        const startColumn = {
            id: startColumnIndex[0],
            todos: endColumnIndex[1].todos
        }
        const endColumn = {
            id: endColumnIndex[0],
            todos: startColumnIndex[1].todos
        }

        // If no change in the order is found, exit early
        if (!startColumn || !endColumn) return;
        // If its also within the same column, exit early
        if (source.index === destination.index && startColumn === endColumn) return;

        // Now we need a copy of all the current todos in the column (avoid mutation)
        const newTodos = startColumn.todos
        const [todoMoved] = newTodos.splice(source.index, 1);
        // If we are moving the todo within the same column
        if (startColumn.id === endColumn.id) {
            // Same column task drag and drop
            newTodos.splice(destination.index, 0, todoMoved);
            // Rebuild the column with the new order of todos (avoid mutation)
            const newColumn = {
                id: startColumn.id,
                todos: newTodos
            }
            // Now we need to rebuild the column with the new order of todos (avoid mutation)
            const newColumns = new Map(board.columns);
            newColumns.set(startColumn.id, newColumn);
            // Finally we update the board state with the new columns
            setBoardState({
                ...board,
                columns: newColumns
            })
        } else {
            // Different column task drag and drop
        }

    }

    return (
        <DragDropContext
            onDragEnd={handleOnDragEnd}
        >
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    // Here we going to render all horizontal columns
                    <div
                        className='grid grid-cols-1 gap-5 md:grid-cols-3 max-w-7xl mx-auto'
                        {...provided.droppableProps} ref={provided.innerRef}
                    >
                        {Array
                            .from(board.columns.entries())
                            .map(([id, column], index) => (
                                <ColumnItem key={id} id={id} todos={column.todos} index={index} />
                            ))}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
