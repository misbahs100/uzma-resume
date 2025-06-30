'use client'

import { useState, useEffect, useRef } from 'react'

export interface DropdownOptionBase {
  id: string
  name: string
}

interface CustomDropdownProps<T extends DropdownOptionBase> {
  values: T[]
  onSelect: (value: T) => void
  selectedId?: string
  placeholder?: string
}

export default function CustomDropdown<T extends DropdownOptionBase>({
  values,
  onSelect,
  selectedId,
  placeholder = 'Select an option',
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [filteredValues, setFilteredValues] = useState<T[]>(values)
  const [selected, setSelected] = useState<T | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const results = values.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredValues(results)
  }, [search, values])

  useEffect(() => {
    if (selectedId) {
      const match = values.find((v) => v.id === selectedId)
      if (match) setSelected(match)
    }
  }, [selectedId, values])

  const handleSelect = (value: T) => {
    setSelected(value)
    onSelect(value)
    setIsOpen(false)
    setSearch('')
  }

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className=" border border-gray-300 rounded-md px-1 md:px-1 py-1 md:py-1 text-left text-sm  shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        {selected ? selected.name : placeholder}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-[50vw] md:w-full rounded-md bg-white shadow-lg max-h-60 overflow-auto border border-gray-200">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="text-sm w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto divide-y divide-gray-100">
            {filteredValues.length > 0 ? (
              filteredValues.map((option:any) => (
                <li
                  key={option.id}
                  onClick={() => handleSelect(option)}
                  className="text-sm cursor-pointer px-4 py-3 hover:bg-teal-100 whitespace-pre-wrap"
                >
                  {option.name} <br />
                  {option.bin}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-gray-400">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
