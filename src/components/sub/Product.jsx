import { useEffect, useState } from 'react';
import Layout from '../common/Layout';
import BackgroundVideo from './backgroundVideo';
import Pic from '../common/Pic';

export default function Product() {
	const [Flickr, setFlickr] = useState([]);
	const [hoveredImage, setHoveredImage] = useState(null);
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const method = 'flickr.people.getPhotos';
		const flickr_api = import.meta.env.VITE_FLICKR_API;
		const myID = '201491599@N03';
		const num = 9;
		const url = `https://www.flickr.com/services/rest/?method=${method}&api_key=${flickr_api}&user_id=${myID}&per_page=${num}&nojsoncallback=1&format=json`;

		fetch(url)
			.then(data => data.json())
			.then(json => {
				setFlickr(json.photos.photo);
			});

		// 화면 크기에 따라 모바일 환경인지 확인
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		window.addEventListener('resize', handleResize);
		handleResize();

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return (
		<div className='product-page'>
			<div className='background-video'>
				<BackgroundVideo />
			</div>
			<Layout title={'Products'}>
				<div className='center-text'>AVALLION UNIVERSE</div>
				<section className={`productList ${isMobile ? 'mobile' : ''}`}>
					{Flickr.map((data, idx) => {
						const imageUrl = `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_z.jpg`;
						return (
							<article
								key={idx}
								className='product-item'
								style={{
									transform: !isMobile ? `rotate(${(360 / Flickr.length) * idx}deg) translate(20vw) rotate(-${(360 / Flickr.length) * idx}deg)` : 'none'
								}}>
								{/* 이미지가 뜨는 순간 제목에선 마우스리브 이벤트가 발생하게 되므로 깜박거리는 현상 발생, 해결방법: onMouseLeave이벤트는 이미지호버시에 적용 */}
								<h3 className='name' onMouseEnter={() => !isMobile && setHoveredImage(imageUrl)}>
									{data.title}
								</h3>
								{/* 모바일 환경에서 바로 이미지를 출력 */}
								{isMobile && <img src={imageUrl} alt={data.title} className='mobile-image' />}
							</article>
						);
					})}
					{!isMobile && hoveredImage && (
						<div className='hovered-image' onMouseLeave={() => setHoveredImage(null)}>
							<img src={hoveredImage} alt='Hovered' />
						</div>
					)}
				</section>
			</Layout>
		</div>
	);
}
