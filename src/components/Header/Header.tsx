"use client";
import Image from "next/image";
import { appConstants } from "@/utils/constants/app";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react"; // Import useEffect, useCallback
import Input from "../Input";
import { IoIosSearch } from "react-icons/io";
import Button from "../Button";
import { FaShuffle } from "react-icons/fa6";
// Import Player type and searchPlayer function
import { getPlayer, searchPlayer, Player } from "@/_api/basketball-api";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Debounce hook (you can place this in a separate hooks file)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const pathList = pathname?.split("/") || [];
  const pathName = pathList[pathList.length - 1] ?? "";

  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  // State to hold the actual search results from the API
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const [isSearching, setIsSearching] = useState(false); // Optional: for loading state
  const [searchError, setSearchError] = useState<string | null>(null); // Optional: for error state

  // Debounce the search value (e.g., wait 500ms after user stops typing)
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleRandomSelect = async () => {
    // Keep random select logic as is
    const randomId = Math.floor(Math.random() * 58387) + 1;
    try {
      const randomPlayer = await getPlayer(randomId);
      if (randomPlayer?.id) {
        router.push(`/player-database/player-profile/${randomPlayer.id}`);
      } else {
        console.warn("Random player not found, trying again...");
      }
    } catch (error) {
      console.error("Error fetching random player:", error);
    }
  };

  // Effect to trigger search when debounced value changes
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchValue.trim().length < 3) {
        setSearchResults([]); // Clear results if search term is too short
        setShowDropdown(false); // Hide dropdown if term is too short
        setIsSearching(false);
        setSearchError(null);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      setShowDropdown(true); // Show dropdown while searching (or adjust as needed)

      try {
        console.log(`Searching for: ${debouncedSearchValue}`); // Log the search term
        const results = await searchPlayer(debouncedSearchValue);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching players:", error);
        setSearchError("Failed to fetch results."); // Set error message
        setSearchResults([]); // Clear results on error
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedSearchValue]); // Only re-run the effect if debouncedSearchValue changes

  // Update input value directly
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    // Show dropdown immediately if typing starts, useEffect handles results/hiding
    if (e.target.value.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false); // Hide if input is cleared
      setSearchResults([]); // Clear results if input is cleared
    }
  };

  const handleInputFocus = () => {
    // Show dropdown on focus only if there's a value and potentially results
    if (searchValue.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Hide dropdown on blur, maybe with a small delay to allow clicking an item
    // Ensure clicking on a result item doesn't immediately hide the dropdown
    setTimeout(() => {
      // Check if the focus is still within the search container or dropdown
      // This simple timeout works for basic cases, more robust solutions might involve checking relatedTarget
      setShowDropdown(false);
    }, 150); // Delay allows click event on dropdown items to register
  };

  const handleResultClick = (player: Player) => {
    router.push(`/player-database/player-profile/${player.id}`);
    setSearchValue(player.name); // Optional: fill input with selected name
    setShowDropdown(false); // Hide dropdown after selection
    setSearchResults([]); // Clear results after selection
  };

  return (
    <div className="flex items-center justify-between w-full h-[80px] border-b-[1px] border-borderLight py-[20px] px-[32px] gap-3">
      <h3 className="font-medium text-2xl leading-8">
        {appConstants?.[(pathName ?? "defaultTitle") as string]}
      </h3>
      <div className="flex gap-3 items-center">
        <div className="relative">
          <Input
            icon={<IoIosSearch size={20} />}
            iconPosition="left"
            placeholder="Search players, teams and leagues" // Updated placeholder
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            autoComplete="off" // Prevent browser autocomplete interference
          />
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 w-full bg-nav-gradient border border-searchBorder rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
              {
                isSearching ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Searching...
                  </div>
                ) : searchError ? (
                  <div className="px-4 py-2 text-sm text-red-400">
                    {searchError}
                  </div>
                ) : debouncedSearchValue.length > 0 &&
                  debouncedSearchValue.length < 3 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Enter at least 3 characters.
                  </div>
                ) : searchResults.length > 0 ? (
                  <ul>
                    {searchResults.map((player) => (
                      <li
                        key={player.id}
                        className="px-4 py-2 text-sm text-white hover:bg-borderPurple cursor-pointer" // Adjusted text color
                        // Use onMouseDown instead of onClick to potentially fire before onBlur hides the dropdown
                        onMouseDown={() => handleResultClick(player)}
                      >
                        {player.name}
                      </li>
                    ))}
                  </ul>
                ) : debouncedSearchValue.length >= 3 ? ( // Only show "No results" if search was attempted
                  <div className="px-4 py-2 text-sm text-gray-400">
                    No results found for &quot;{debouncedSearchValue}&quot;.
                  </div>
                ) : null /* Don't show anything if input is empty or < 3 chars and not searching */
              }
            </div>
          )}
        </div>
        <Button icon={<FaShuffle size={14} />} onClick={handleRandomSelect} />
        <Link href="/notifications" className="px-4">
          <Image
            src="/icons/sidebar/notifications.png"
            alt="Notifications"
            width={24}
            height={24}
          />
        </Link>
        <Image
          src="/icons/avatar-placeholder.png"
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
      </div>
    </div>
  );
};

export default Header;
