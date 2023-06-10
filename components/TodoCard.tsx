'use client';

import getUrl from '@/libs/getUrl';
import useBoardStore from '@/store/BoardStore';
import { MinusCircleIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import React, { useEffect } from 'react';
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

    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getUrl(todo.image!);
                if (url) setImageUrl(url.toString());
            };
            fetchImage();
        }
    }, [todo]);

    return (
        <article
            className='bg-white rounded-md space-y-2 drop-shadow-md'
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
        >
            <div className='flex p-[13px] justify-between items-center'>
                <p>{todo.title}</p>
                <button className='text-gray-600 hover:text-red-600 hover:scale-105 transition-all duration-200'>
                    <MinusCircleIcon
                        onClick={() => deleteTodo(index, todo, id)}
                        className='ml-5 h-5 w-5'
                    />
                </button>
            </div>

            {imageUrl && (
                <div className='relative h-full w-full rounded-b-md'>
                    <Image
                        src={imageUrl}
                        alt='Todo Image'
                        width={400}
                        height={200}
                        className='w-full h-48 object-cover rounded-b-md'
                    />
                </div>
            )}
        </article>
    );
}
