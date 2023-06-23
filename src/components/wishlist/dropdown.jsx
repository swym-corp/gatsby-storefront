import React, { useState } from "react";
import "./dropdown.css"

/*
  @author: swym
  @notice: wishlist dropdown
  @dev:    component for wishlist dropdown
  @param:  lists - array of lists
  @param:  selectedListName - selected list name
  @param:  onListChange - on changing list function
*/

function Dropdown({ lists, selectedListName, onListChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };
    const handleListChange = (lname, lid) => {
        onListChange(lname, lid)
        setIsOpen(false)
    }

    return (
        <div className="dropdown">
            <button className="dropdown-toggle" onClick={toggleDropdown}>
                {selectedListName}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`dropdown-icon ${isOpen ? 'open' : ''}`}>
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <ul>
                        {Array.isArray(lists) && lists.map(e => (<li key={e.lid} onClick={() => {
                            handleListChange(e.lname, e.lid)
                        }}>{e.lname} ({e.cnt})</li>))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dropdown;
