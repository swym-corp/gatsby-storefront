import * as React from "react";

function WishlistIcon(props) {
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
                d="M12 20.7l-1.258-1.157C5.672 15.294 2 12.124 2 8.5 2 5.462 4.462 3 7.5 3c1.852 0 3.592.906 4.5 2.35C13.908 3.906 15.648 3 17.5 3 20.538 3 23 5.462 23 8.5c0 3.624-3.672 6.794-8.742 11.043L12 20.7z"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default WishlistIcon;
