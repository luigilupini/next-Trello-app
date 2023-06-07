'use client';

import React from 'react';
import Image from 'next/image';

import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid';

import trello from '../public/logo/trello.png';
import Avatar from 'react-avatar';

export default function Header() {
    return (
        <header>
            <div className="flex flex-col items-center justify-between p-5 bg-gray-500/10 backdrop:blur-xl md:flex-row">
                <Image
                    src={trello}
                    alt="Trello Logo"
                    width={300}
                    height={100}
                    className="object-contain pb-10 w-44 md:w-36 md:pb-0"
                />
                <div className="flex items-center justify-end flex-1 w-full gap-5">
                    {/* Search Box */}
                    <form className="flex items-center flex-1 p-2 space-x-5 bg-white rounded-md shadow-md md:flex-initial">
                        <MagnifyingGlassIcon className="w-6 h-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 p-2 outline-none"
                        />
                        <button type="submit" hidden>
                            Search
                        </button>
                    </form>

                    {/* Avatar */}
                    <Avatar
                        name="Luigi Lupini"
                        size="50"
                        round={true}
                        color="#0055D1"
                    />
                </div>
            </div>
        </header>
    );
}
