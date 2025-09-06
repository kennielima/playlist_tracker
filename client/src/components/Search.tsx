import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

const Search = ({ category }: { category: string }) => {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const searchHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query) return;
        router.push(`/search?q=${query}`);
    }
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }
    let placeholder;
    if (category === 'playlist') {
        placeholder = "Search for playlist"
    } else if (category === 'track') {
        placeholder = "Search for track"
    }

    return (
        <form
            onSubmit={searchHandler}
            className={`${category === 'playlist' && 'max-w-md '} flex w-full items-center gap-1 size-8 justify-center mx-auto`}
        >
            <Input
                type="search"
                placeholder={placeholder}
                className={`
                    ${category === 'playlist' && "h-12"} 
                    ${category === 'track' && "h-10"}
                    `}
                onChange={changeHandler}
            />
            <Button
                type="submit"
                variant="outline"
                className={`${category === 'playlist' && "h-12"} 
                    ${category === 'track' && "h-10"} bg-purple-600 hover:bg-purple-500 text-white`}
            >
                Search
            </Button>
        </form>)
}

export default Search