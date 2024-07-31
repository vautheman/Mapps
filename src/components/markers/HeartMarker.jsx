import { RiHeartFill } from "@remixicon/react";

// eslint-disable-next-line react/prop-types
const HeartMarker = ({location, size}) => {
    return (
        <div className="marker bg-red-500 p-1 rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer">
            <RiHeartFill size={size}/>
        </div>
    );
};

export default HeartMarker;