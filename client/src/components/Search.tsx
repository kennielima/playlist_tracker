import React, { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';

const Search = () => {
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
    return (
        <form
            onSubmit={searchHandler}
            className="flex w-full max-w-md items-center gap-1 size-8 justify-center mx-auto"
        >
            <Input
                type="search"
                placeholder="Search for playlist"
                className="h-12"
                onChange={changeHandler}
            />
            <Button
                type="submit"
                variant="outline"
                className="h-12 bg-purple-600 hover:bg-purple-500 text-white"
            >
                Subscribe
            </Button>
        </form>)
}

export default Search