'use client';

import React, { useEffect } from 'react';
import useBoardStore from '@/store/BoardStore';

import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';
import ColumnItem from './ColumnItem';

export default function Board() {
    const board = useBoardStore((state) => state.board);
    const getBoard = useBoardStore((state) => state.getBoard)

    useEffect(() => {
        // Calling a Zustand action here getBoard to fetch the board data
        getBoard();
    }, [getBoard]);
    console.log(board)

    // This will trigger when you let go of a draggable operation
    const handleOnDragEnd = (result: DropResult) => {
        console.log(result)
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
