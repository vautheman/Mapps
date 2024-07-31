import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import PropTypes from 'prop-types';

import 'swiper/css'
import 'swiper/css/pagination';
import { useRef, useState} from 'react';

const SwiperMarker = ({images}) => {
    /* console.log(images) */

    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };
  
    return (
        <Swiper
            spaceBetween={50}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            modules={[Autoplay]}
            onAutoplayTimeLeft={onAutoplayTimeLeft}
            grabCursor={true}
            className="mySwiper"
        >
            {
                images.map((image) => (
                    <SwiperSlide key={image} className='mb-5'>
                        <img className='w-full aspect-video object-cover rounded-md' src={`https://api.autheman-victor.fr${image.attributes.formats.medium.url}`} alt="" />
                    </SwiperSlide>
                ))
            }
            {
                images.length > 0 &&
                <div className="autoplay-progress absolute z-20 right-1 bottom-6 w-8 h-8 text-xs flex items-center justify-center font-bold text-black" slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            }
            
        </Swiper>
    );
};

SwiperMarker.PropTypes = {
    images: PropTypes.array.isRequired
}
export default SwiperMarker;