'use client';

import React, { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function Board() {
    useEffect(() => {
        // Calling a action like getBoardData() here that needs to be global :)
    }, []);
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
