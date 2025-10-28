
/* global kakao */
import React, { useEffect, useRef, useState } from 'react';
import './MapPage.css'; // CSS 파일을 위한 임포트

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 좌표 (제주도)
          level: 3,
        };
        const kakaoMap = new kakao.maps.Map(container, options);
        setMap(kakaoMap);
        setInfoWindow(new kakao.maps.InfoWindow({ zIndex: 1 }));

        // 현재 위치를 가져와 지도의 중심을 설정
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locPosition = new kakao.maps.LatLng(lat, lon);
            kakaoMap.setCenter(locPosition);
          });
        }
      });
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const searchPlaces = (keyword) => {
    if (!map) return;

    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 없습니다.');
      } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
      }
    });
  };

  const displayPlaces = (places) => {
    // 기존 마커 제거
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];

    for (let i = 0; i < places.length; i++) {
      const placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
      const marker = addMarker(placePosition, i);
      newMarkers.push(marker);
      bounds.extend(placePosition);

      ((marker, title) => {
        kakao.maps.event.addListener(marker, 'click', () => {
          displayInfoWindow(marker, title);
        });
      })(marker, places[i].place_name);
    }

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const addMarker = (position, idx) => {
    const marker = new kakao.maps.Marker({
      position: position,
    });

    marker.setMap(map);
    return marker;
  };

  const displayInfoWindow = (marker, title) => {
    const content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
  };

  return (
    <div className="MapPage_container">
      <div className="MapPage_search-box">
        <input type="text" id="keyword" placeholder="동물병원 또는 애완동물 샵을 검색하세요" />
        <button onClick={() => {
          const userInput = document.getElementById('keyword').value;
          const combinedKeyword = `${userInput} 동물병원 애완동물 샵`;
          searchPlaces(combinedKeyword);
        }}>검색</button>
      </div>
      <div id="map" ref={mapRef} className="MapPage_map"></div>
    </div>
  );
};

export default MapPage;
