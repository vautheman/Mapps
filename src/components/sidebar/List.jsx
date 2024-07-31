// sidebar/List.jsx

import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { simulateMarkerClick } from "../../utils/mapUtils";
import HeartMarker from "../markers/HeartMarker";
import { useState } from "react";
import CampingMarker from "../markers/CampingMarker";
import ParcMarker from "../markers/ParcMarker";

const List = ({locations, markerRefs, map, setMarkerSelected}) => {

    const items = locations.filter(location => location.attributes.type !== 'image')

    const categoryNames = {
        heart: 'Coup de coeur',
        camping: 'Camping',
        parc: 'Parc & Paysage'
    }
    
    const groupedItems = items.reduce((acc, item) => {
        const type = item.attributes.type;
        const formattedType = categoryNames[type] || type;
        if (!acc[formattedType]) {
            acc[formattedType] = [];
        }
        acc[formattedType].push(item);
        return acc;
    }, {});
    
    // Toggle visible catégories
    const [visibleTypes, setVisibleTypes] = useState({});

    const toggleVisibility = (type) => {
        setVisibleTypes(prev => ({
            ...prev,
            [type]: !prev[type] // Inverse la visibilité actuelle
        }));
    };

    const handleClick = (id) => {
        simulateMarkerClick(id, markerRefs, map, setMarkerSelected);
    };

    return (
        <div className='mb-10'>
            <header className='flex justify-between border-b border-black/20 pb-2 mb-4 items-center'>
                <h3 className='text-2xl font-bold'>Lieux</h3>
            </header>

            {
                Object.keys(groupedItems).map((type) => (
                    <div key={type}>
                        <header className="flex items-baseline justify-between pb-2 mt-5">
                            <h4 className="text-lg font-bold">{type}</h4>
                            {/* <span className="text-xs">({groupedItems[type].length})</span> */}
                            {
                                !visibleTypes[type] ? <RiEyeOffLine className="cursor-pointer" size={16} onClick={() => toggleVisibility(type)} /> : <RiEyeLine className="cursor-pointer" size={16} onClick={() => toggleVisibility(type)} />
                            }
                        </header>
                        {
                            !visibleTypes[type] && 
                            <ul className="flex flex-col gap-1">
                                {
                                    groupedItems[type].map((item) => {
                                        const renderItem = () => {
                                            switch (item.attributes.type) {
                                                case 'heart':
                                                    return <HeartMarker key={item.id} size={12} />;
                                                case 'camping': 
                                                    return <CampingMarker key={item.id} size={12} />
                                                case 'parc':
                                                    return <ParcMarker key={item.id} size={12} />
                                                default:
                                                    return null; // Ajoutez d'autres cas si nécessaire
                                            }
                                        };

                                        return (
                                            <li key={item.id} onClick={() => handleClick(item.id)} className="cursor-pointer">
                                                <div className="flex gap-1 items-center">
                                                    {renderItem()}
                                                    <p>{item.attributes.name}</p>
                                                </div>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        }
                    </div> // Correction de la balise de fermeture
                ))
            }
        </div>
    );
};

export default List;