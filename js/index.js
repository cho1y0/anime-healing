// js/index.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('anime-grid');

    // 🚀 프론트엔드 UI 확인을 위한 임시(Mock) 데이터
    // 나중에는 GET /anime/recommend API를 호출해서 이 배열을 채울 예정입니다.
    const dummyAnimeData = [
        {
            mal_id: 1,
            title: "스파이 패밀리",
            image_url: "https://picsum.photos/250/350?random=1", // 임시 이미지
            score: 8.5,
            genres: ["액션", "코미디"],
            ai_comment: "마음을 따뜻하게 해주는 유쾌한 가족 코미디입니다. 가볍게 힐링하기 좋아요!"
        },
        {
            mal_id: 2,
            title: "주술회전",
            image_url: "https://picsum.photos/250/350?random=2",
            score: 8.7,
            genres: ["액션", "판타지"],
            ai_comment: "화려한 액션과 몰입감 넘치는 세계관! 열혈 액션을 좋아하신다면 강력 추천합니다."
        },
        {
            mal_id: 3,
            title: "장송의 프리렌",
            image_url: "https://picsum.photos/250/350?random=3",
            score: 9.1,
            genres: ["드라마", "판타지"],
            ai_comment: "잔잔한 여운이 남는 명작입니다. 모험의 끝에서 시작되는 새로운 이야기를 만나보세요."
        },
        {
            mal_id: 4,
            title: "최애의 아이",
            image_url: "https://picsum.photos/250/350?random=4",
            score: 8.9,
            genres: ["드라마", "미스터리"],
            ai_comment: "연예계의 이면을 다룬 충격적인 전개! 한번 시작하면 멈출 수 없는 몰입감을 줍니다."
        }
    ];

    // 카드 생성 및 렌더링 함수
    function renderCards(animeList) {
        grid.innerHTML = ''; // 기존 내용 지우기

        animeList.forEach(anime => {
            // 카드 바깥쪽 껍데기
            const card = document.createElement('div');
            card.className = 'anime-card';
            // 카드 클릭 시 상세 페이지 이동 로직 (하트 버튼 클릭 시엔 이동 안 함)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.heart-btn')) {
                    window.location.href = `detail.html?mal_id=${anime.mal_id}`;
                }
            });

            // 내부 HTML 구조
            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${anime.image_url}" alt="${anime.title}" class="card-image">
                    <button class="heart-btn" data-id="${anime.mal_id}">🤍</button>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${anime.title}</h4>
                    <div class="card-meta">
                        <span class="card-score">⭐ ${anime.score.toFixed(1)}</span>
                        <span class="card-genres">${anime.genres.join(', ')}</span>
                    </div>
                    <div class="ai-comment">
                        🤖 <strong>AI 추천:</strong><br>
                        ${anime.ai_comment}
                    </div>
                </div>
            `;

            grid.appendChild(card);
        });

        // 하트 버튼(보고싶다 토글) 이벤트 리스너 추가
        document.querySelectorAll('.heart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const animeId = btn.dataset.id;
                
                // 시각적 토글 처리
                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    btn.innerText = '🤍';
                    // 나중에는 여기서 DELETE /watchlist/{mal_id} 호출
                } else {
                    btn.classList.add('active');
                    btn.innerText = '❤️';
                    // 나중에는 여기서 POST /watchlist 호출
                }
            });
        });
    }

    // 초기 데이터 렌더링 실행
    renderCards(dummyAnimeData);
});