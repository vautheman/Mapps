import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { simulateMarkerClick } from '../../utils/mapUtils';

import 'swiper/css';

const Story = ({locations, markerRefs, map, setMarkerSelected}) => {

    const storys = locations.filter(location => location.attributes.type === 'image')

    const handleClick = (id) => {
        simulateMarkerClick(id, markerRefs, map, setMarkerSelected);
    };

    return (
        <div className='mb-10'>
            <header className='flex justify-between border-b border-black/20 pb-2 mb-4 items-center'>
                <h3 className='text-2xl font-bold'>Souvenirs</h3>
            </header>
            <Swiper
                spaceBetween={10}
                slidesPerView={4}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {
                    storys.map((story) => (
                        <SwiperSlide key={story.id} onClick={() => handleClick(story.id)} className='cursor-pointer'>
                            <div className='mx-auto aspect-square w-14 rounded-full p-[2px] border-2 border-white' >
                                <span className='w-full h-full bg-cover block rounded-full' style={{ backgroundImage: `url(https://api.autheman-victor.fr${story.attributes.images.data[0].attributes.formats.thumbnail.url})` }}></span>
                            </div>
                            <p className='text-xs text-center mt-1'>{story.attributes.name}</p>
                        </SwiperSlide>
                    ))
                }    
            </Swiper>
        </div>
    );
};

export default Story;