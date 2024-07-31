import { RiTreeFill } from "@remixicon/react";

// eslint-disable-next-line react/prop-types
const ParcMarker = ({location, size}) => {
    return (
        <div className="marker bg-green-500 p-1 rounded-full flex items-center justify-center text-white shadow-sm cursor-pointer">
            <RiTreeFill size={size}/>
        </div>
    );
};

export default ParcMarker;