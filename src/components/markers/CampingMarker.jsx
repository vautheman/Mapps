import { RiCaravanFill } from "@remixicon/react";

// eslint-disable-next-line react/prop-types
const CampingMarker = ({location, size}) => {
    return (
        <div className="marker bg-blue-500 p-1 rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer">
            <RiCaravanFill size={size}/>
        </div>
    );
};

export default CampingMarker;