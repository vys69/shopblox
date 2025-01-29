import { useState } from "react";

const SearchComponent = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const response = await fetch(`/api/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        setResults(data);
    };

    return (
        <div>
            <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {results.map((item: any) => (
                    <li key={item.slug}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent; 