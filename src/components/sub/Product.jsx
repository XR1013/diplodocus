import { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import BackgroundVideo from './backgroundVideo';

export default function Product() {
    const [Flickr, setFlickr] = useState([]);
    const [hoveredImage, setHoveredImage] = useState(null);

    // 모바일인지 확인하는 상태
    const isMobile = window.innerWidth <= 599;

    useEffect(() => {
        const method = 'flickr.people.getPhotos';
        const flickr_api = import.meta.env.VITE_FLICKR_API;
        const myID = '201491599@N03';
        const num = 9;
        const url = `https://www.flickr.com/services/rest/?method=${method}&api_key=${flickr_api}&user_id=${myID}&per_page=${num}&nojsoncallback=1&format=json`;

        fetch(url)
            .then((data) => data.json())
            .then((json) => {
                setFlickr(json.photos.photo);
            });
    }, []);

    const totalImages = Flickr.length;
    const angleStep = 360 / totalImages;

    return (
        <div className="product-page">
            <div className="background-video">
                <BackgroundVideo />
            </div>
            <Layout title={"Products"}>
                <div className="center-text">AVALLION UNIVERSE</div>
                <section className="productList">
                    {Flickr.map((data, idx) => {
                        const rotation = angleStep * idx;
                        return (
                            <article
                                key={idx}
                                className="product-item"
                                style={{
                                    transform: `rotate(${rotation}deg) translate(20vw) rotate(-${rotation}deg)`,
                                }}
                            >
                                <h3
                                    className="name"
                                    // 모바일 환경이 아닐 때만 onMouseEnter 이벤트 적용
                                    onMouseEnter={
                                        !isMobile
                                            ? () =>
                                                  setHoveredImage(
                                                      `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_z.jpg`
                                                  )
                                            : null
                                    }
                                    onMouseLeave={!isMobile ? () => setHoveredImage(null) : null}
                                >
                                    {data.title}
                                </h3>
                            </article>
                        );
                    })}
                    {/* 모바일 환경이 아닐 때만 hoveredImage 표시 */}
                    {!isMobile && hoveredImage && (
                        <div className="hovered-image">
                            <img src={hoveredImage} alt="Hovered" />
                        </div>
                    )}
                </section>
            </Layout>
        </div>
    );
}
