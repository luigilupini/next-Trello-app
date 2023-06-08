'use client';

import React, { useEffect } from 'react';
import useBoardStore from '@/store/BoardStore';

import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function Board() {
    const board = useBoardStore((state) => state.board);
    const getBoard = useBoardStore((state) => state.getBoard)

    useEffect(() => {
        // Calling a Zustand action here getBoard to fetch the board data
        getBoard();
    }, [getBoard]);
    console.log(board)
    return (
        <DragDropContext
            onDragEnd={(result) => {
                console.log(result);
            }}
        >
            <Droppable droppableId="board" direction="horizontal" type="column">
                {(provided) => (
                    // Here we going to render all horizontal columns
                    <div className=""></div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
