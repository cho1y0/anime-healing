// js/watchlist.js

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('watchlist-grid');
    const emptyState = document.getElementById('empty-state');

    // 🚀 프론트엔드 확인용 더미 데이터 (내가 찜한 목록)
    let mockWatchlist = [
        { mal_id: 1, title: "스파이 패밀리", image_url: "https://picsum.photos/250/350?random=1", score: 8.5, genres: ["액션", "코미디"] },
        { mal_id: 3, title: "장송의 프리렌", image_url: "https://picsum.photos/250/350?random=3", score: 9.1, genres: ["드라마", "판타지"] }
    ];

    // 화면 렌더링 함수
    function renderWatchlist() {
        grid.innerHTML = ''; // 기존 카드 초기화

        // 찜한 데이터가 0개면 빈 화면을 띄움
        if (mockWatchlist.length === 0) {
            emptyState.classList.remove('hidden');
            grid.classList.add('hidden');
            return;
        } else {
            emptyState.classList.add('hidden');
            grid.classList.remove('hidden');
        }

        // 데이터가 있으면 카드 생성
        mockWatchlist.forEach(anime => {
            const card = document.createElement('div');
            card.className = 'anime-card'; // index.css 디자인 재사용
            
            card.innerHTML = `
                <div class="card-image-wrap">
                    <img src="${anime.image_url}" alt="${anime.title}" class="card-image">
                    <button class="delete-btn" data-id="${anime.mal_id}">🗑️</button>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${anime.title}</h4>
                    <div class="card-meta">
                        <span class="card-score">⭐ ${anime.score.toFixed(1)}</span>
                        <span class="card-genres">${anime.genres.join(', ')}</span>
                    </div>
                </div>
            `;

            // 카드 클릭 시 상세 페이지 이동  (단, 삭제 버튼 누를 땐 제외)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    window.location.href = `detail.html?mal_id=${anime.mal_id}`;
                }
            });

            grid.appendChild(card);
        });

        // 삭제 버튼(휴지통) 이벤트 연결
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = parseInt(btn.dataset.id);
                
                // 해당 ID를 배열에서 삭제
                mockWatchlist = mockWatchlist.filter(item => item.mal_id !== idToDelete);
                
                // 화면 다시 그리기 (마지막 1개를 지우면 자동으로 빈 화면 뜸)
                renderWatchlist();
            });
        });
    }

    // 초기 화면 렌더링 실행
    renderWatchlist();
});