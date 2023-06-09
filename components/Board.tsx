'use client';

import React, { useEffect } from 'react';
import useBoardStore from '@/store/BoardStore';

import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import ColumnItem from './ColumnItem';

export default function Board() {
    const [board, getBoard, setBoard] = useBoardStore((state) => [
        state.board,
        state.getBoard,
        state.setBoard
    ])

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

        // * NO DESTINATION
        // If the user drags outside of the board meaning any destination, exit early
        if (!destination) return;

        // * COLUMN DRAG & DROP (WITHIN BOARD)
        // Lets handle a column drag and drop operation
        if (type === 'column') {
            const newBoard = Array.from(board.columns.entries());
            const [removed] = newBoard.splice(source.index, 1);
            newBoard.splice(destination.index, 0, removed);
            // Rebuild columns with the new order (avoid mutation)
            const rearrangedColumns = new Map(newBoard);
            setBoard({ ...board, columns: rearrangedColumns })
            return // Exit return if no other operation is needed
        }

        // * REQUIRED MAP INTO ARRAY SPLICING OPERATION
        // Lets handle the card drag and drop operation
        // The create/convert `from` an iterable object the Map to an Array
        // We need a copy of all the current columns in the board (avoid mutation)
        const currentColumns = Array.from(board.columns);
        // Next we figure out the start & end index by using the `source` and `destination` from result parameter
        const startColIndex = currentColumns[Number(source.droppableId)]
        const finishColIndex = currentColumns[Number(destination.droppableId)]
        // With these values we rebuilding the desired start & end columns with the new order of todos
        const startCol = {
            id: startColIndex[0],
            todos: startColIndex[1].todos
        }
        const finishCol = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos
        }
        // If no change in the order is found, exit early
        if (!startCol || !finishCol) return;
        // If its also within the same column, exit early
        if (source.index === destination.index && startCol === finishCol) return;
        // Now we need a copy of all the current todos in the column (avoid mutation)
        const newTodos = startCol.todos
        const [todoMoved] = newTodos.splice(source.index, 1);

        // * CARD DRAG & DROP (WITHIN SAME COLUMN)
        // If we are moving the todo within the same column
        if (startCol.id === finishCol.id) {
            // Same column task drag and drop
            newTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id: startCol.id,
                todos: newTodos
            }
            // Rebuild the column with the new order of todos (avoid mutation)
            // Now we need to rebuild the column with the new order of todos (avoid mutation)
            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);
            // Finally we update the board state with the new columns
            setBoard({ ...board, columns: newColumns })
        } else {
            // * CARD DRAG & DROP (FOR DIFFERENT COLUMN)
            // Different column task drag and drop has to modify start & finish columns
            // You have to make the correct changes in each column to reflect the interaction
            const finishTodos = Array.from(finishCol.todos);
            finishTodos.splice(destination.index, 0, todoMoved);

            const newColumns = new Map(board.columns);
            const newCol = {
                id: startCol.id,
                todos: newTodos
            }
            // Here we actually update the start and finish column arrangements
            newColumns.set(startCol.id, newCol)
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos
            })
            setBoard({ ...board, columns: newColumns })
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
