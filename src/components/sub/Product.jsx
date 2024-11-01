import { useEffect, useState } from 'react'; // React Hook 사용을 위해 import
import Layout from '../common/Layout'; // 페이지 레이아웃 컴포넌트
import BackgroundVideo from './backgroundVideo'; // 배경 비디오 컴포넌트
import Pic from '../common/Pic'; // 사진 컴포넌트

export default function Product() {
	const [Flickr, setFlickr] = useState([]); // 플리커 API에서 가져온 사진 데이터를 담을 상태 변수
	const [hoveredImage, setHoveredImage] = useState(null); // 마우스 오버된 이미지 URL을 담을 상태 변수
	const [isMobile, setIsMobile] = useState(false); // 모바일 화면 여부를 판단하는 상태 변수

	useEffect(() => {
		// 플리커 API 요청 파라미터 설정
		const method = 'flickr.people.getPhotos'; // 가져올 API 메소드명
		const flickr_api = import.meta.env.VITE_FLICKR_API; // 환경 변수로 저장된 API 키
		const myID = '201491599@N03'; // 플리커 사용자 ID
		const num = 9; // 요청할 이미지 개수
		const url = `https://www.flickr.com/services/rest/?method=${method}&api_key=${flickr_api}&user_id=${myID}&per_page=${num}&nojsoncallback=1&format=json`;

		// 플리커 API에서 데이터 가져오기
		fetch(url)
			.then(data => data.json()) // 응답을 JSON으로 변환
			.then(json => {
				setFlickr(json.photos.photo); // 사진 데이터 배열을 상태에 저장
			});

		// 화면 크기에 따라 모바일인지 여부를 업데이트하는 함수
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768); // 화면 너비가 768px 이하이면 모바일로 간주
		};

		// 윈도우 창 크기 조정 시 handleResize 호출
		window.addEventListener('resize', handleResize);
		handleResize(); // 초기화할 때도 한 번 실행

		// 컴포넌트가 해제될 때 이벤트 리스너를 제거
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

	return (
		<div className='product-page'> {/* 전체 제품 페이지 컨테이너 */}
			<div className='background-video'>
				<BackgroundVideo /> {/* 배경 비디오 컴포넌트 */}
			</div>
			<Layout title={'Products'}> {/* 레이아웃 컴포넌트, 제목으로 'Products' 전달 */}
				<div className='center-text'>AVALLION UNIVERSE</div> {/* 페이지 중앙 텍스트 */}
				<section className={`productList ${isMobile ? 'mobile' : ''}`}> {/* 제품 리스트, 모바일 여부에 따라 클래스 설정 */}
					{/* Flickr 상태의 데이터를 반복하여 각 이미지를 렌더링 */}
					{Flickr.map((data, idx) => {
						const imageUrl = `https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_z.jpg`; // 플리커 이미지 URL 생성
						return (
							<article
								key={idx} // React key 속성
								className='product-item'
								style={{
									// 모바일이 아닌 경우 이미지가 원형으로 배치되도록 transform 스타일 설정
									transform: !isMobile ? `rotate(${(360 / Flickr.length) * idx}deg) translate(20vw) rotate(-${(360 / Flickr.length) * idx}deg)` : 'none'
								}}>
								{/* 이미지가 뜨는 순간 제목에서 마우스리브 이벤트 발생으로 깜박거리는 현상 발생, onMouseLeave 이벤트는 이미지 호버 시에만 적용 */}
								<h3 className='name' onMouseEnter={() => !isMobile && setHoveredImage(imageUrl)}> {/* 모바일이 아닌 경우만 마우스 오버 시 hoveredImage 상태 업데이트 */}
									{data.title} {/* 이미지 제목 */}
								</h3>
								{/* 모바일 환경일 때 이미지를 바로 출력 */}
								{isMobile && <img src={imageUrl} alt={data.title} className='mobile-image' />}
							</article>
						);
					})}
					{/* 모바일이 아니고 hoveredImage가 설정된 경우 큰 이미지 표시 */}
					{!isMobile && hoveredImage && (
						<div className='hovered-image' onMouseLeave={() => setHoveredImage(null)}> {/* 마우스가 떠날 때 hoveredImage 상태 초기화 */}
							<img src={hoveredImage} alt='Hovered' /> {/* hoveredImage 상태에 저장된 이미지 URL 사용 */}
						</div>
					)}
				</section>
			</Layout>
		</div>
	);
}
