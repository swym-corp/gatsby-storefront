import React from "react";

function UserIcon(props) {
    return (
        <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M12 2C8.69 2 6 4.69 6 8C6 9.71 6.83 11.28 8 12.46V14C8 16.76 10.24 19 13 19H14.54C15.72 20.17 17.29 21 19 21C19.55 21 20 20.55 20 20V19C20 16.24 17.76 14 15 14H9C6.24 14 4 16.24 4 19V20C4 20.55 4.45 21 5 21C6.71 21 8.28 20.17 9.46 19H11C13.76 19 16 16.76 16 14V12.46C17.17 11.28 18 9.71 18 8C18 4.69 15.31 2 12 2ZM12 4C14.21 4 16 5.79 16 8C16 10.21 14.21 12 12 12C9.79 12 8 10.21 8 8C8 5.79 9.79 4 12 4Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default UserIcon;
