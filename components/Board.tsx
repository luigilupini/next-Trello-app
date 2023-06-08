'use client';

import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export default function Board() {
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
