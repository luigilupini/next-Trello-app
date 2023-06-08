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
            const newEntries = Array.from(board.columns.entries());
            const [removed] = newEntries.splice(source.index, 1);
            newEntries.splice(destination.index, 0, removed);
            const rearrangedColumns = new Map(newEntries);
            setBoardState({
                ...board,
                columns: rearrangedColumns
            })
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
