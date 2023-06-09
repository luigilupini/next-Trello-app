'use client';

import useBoardStore from '@/store/BoardStore';
import { XCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import {
    DraggableProvidedDragHandleProps,
    DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd';

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

export default function TodoCard({
    todo,
    index,
    id,
    innerRef,
    draggableProps,
    dragHandleProps,
}: Props) {
    const [deleteTodo] = useBoardStore((state) => [state.deleteTodo]);
    return (
        <article
            className='bg-white rounded-md space-y-2 drop-shadow-md'
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
        >
            <div className='flex p-5 justify-between items-center'>
                <p>{todo.title}</p>
                <button className='text-red-500 hover:text-red-600'>
                    <XCircleIcon
                        onClick={() => deleteTodo(index, todo, id)}
                        className='ml-5 h-5 w-5'
                    />
                </button>
            </div>
        </article>
    );
}
