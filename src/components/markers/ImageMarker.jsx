// eslint-disable-next-line react/prop-types
const ImageMarker = ({location}) => {
    return (
        <div className="relative transition-all duration-150">
            <div className="bg-cover w-12 h-12 rounded-full cursor-pointer border-[3px] border-white shadow-md z-10 relative" style={{ backgroundImage: `url(https://api.autheman-victor.fr${location.attributes.images.data[0].attributes.formats.thumbnail.url})` }}>
            </div>
            <p className="font-bold text-xs w-max max-w-28 py-1 px-2 pl-7 bg-white shadow-md absolute top-1/2 right-0 translate-x-3/4 -translate-y-1/2 rounded-md leading-4">{location.attributes.name}</p>
        </div>
    );
};

export default ImageMarker;