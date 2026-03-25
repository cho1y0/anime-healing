// js/detail.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. URL에서 애니메이션 ID(mal_id) 추출하기
    const urlParams = new URLSearchParams(window.location.search);
    const malId = urlParams.get('mal_id');

    // (임시) 만약 mal_id 없이 접속하면 홈으로 돌려보내기
    if (!malId) {
        alert("잘못된 접근입니다.");
        window.location.href = 'index.html';
        return;
    }

    // 2. 🚀 프론트엔드 확인용 더미 데이터
    const mockAnimeDetail = {
        title: "장송의 프리렌",
        image_url: "https://picsum.photos/300/450?random=3", // 임시 이미지
        score: 9.1,
        genres: ["드라마", "판타지", "모험"],
        synopsis: "마왕을 쓰러뜨린 용사 일행의 마법사 프리렌. 엘프인 그녀에게 인간의 수명은 너무나도 짧다. 용사 힘멜의 죽음을 계기로 인간을 '알기' 위한 그녀의 새로운 여정이 시작된다. 잔잔하면서도 깊은 울림을 주는 웰메이드 판타지.",
        ai_summary: "대부분의 유저들이 '작화와 연출이 압도적이다', '잔잔하면서도 깊은 감동을 준다'며 극찬하고 있습니다. 특히 시간의 흐름을 표현하는 방식에 대한 호평이 많아, 완성도 높은 드라마를 원하는 분들께 강력 추천하는 분위기입니다.",
        stats: { avg_score: 9.1, total_reviews: 124 }
    };

    const mockReviews = [
        { id: 1, author: "애니매니아", score: 10, content: "올해 최고의 명작입니다. 작화, 브금, 스토리 모두 완벽해요.", date: "2026. 03. 24" },
        { id: 2, author: "힐링이필요해", score: 9, content: "자극적이지 않아서 오히려 더 여운이 남네요. 추천합니다.", date: "2026. 03. 22" }
    ];

    // 3. 화면에 데이터 뿌려주기
    document.getElementById('detail-poster').src = mockAnimeDetail.image_url;
    document.getElementById('detail-title').innerText = mockAnimeDetail.title;
    document.getElementById('detail-score').innerText = `⭐ ${mockAnimeDetail.score.toFixed(1)}`;
    document.getElementById('detail-synopsis').innerText = mockAnimeDetail.synopsis;
    document.getElementById('detail-ai-summary').innerText = mockAnimeDetail.ai_summary;
    document.getElementById('stat-avg-score').innerText = mockAnimeDetail.stats.avg_score.toFixed(1);
    document.getElementById('stat-total-reviews').innerText = mockAnimeDetail.stats.total_reviews;

    // 장르 태그 생성
    const genresWrap = document.getElementById('detail-genres');
    mockAnimeDetail.genres.forEach(genre => {
        const span = document.createElement('span');
        span.className = 'badge genre-badge';
        span.innerText = genre;
        genresWrap.appendChild(span);
    });

    // 4. 리뷰 목록 렌더링 함수
    const reviewList = document.getElementById('review-list');
    function renderReviews(reviews) {
        reviewList.innerHTML = ''; // 초기화
        reviews.forEach(review => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <div class="review-item-header">
                    <span class="reviewer-name">👤 ${review.author}</span>
                    <span class="review-date">${review.date}</span>
                </div>
                <div class="review-item-score">⭐ ${review.score}점</div>
                <div class="review-item-content">${review.content}</div>
            `;
            reviewList.appendChild(div);
        });
    }
    renderReviews(mockReviews);

    // 5. 보고싶다(하트) 버튼 토글 로직
    const watchlistBtn = document.getElementById('detail-watchlist-btn');
    watchlistBtn.addEventListener('click', () => {
        watchlistBtn.classList.toggle('active');
        if (watchlistBtn.classList.contains('active')) {
            watchlistBtn.innerHTML = '❤️ 보고싶다 취소';
        } else {
            watchlistBtn.innerHTML = '🤍 보고싶다';
        }
    });

    // 6. 리뷰 작성 폼 제출 로직
    const reviewForm = document.getElementById('review-form');
    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault(); // 페이지 새로고침 방지
        
        const score = document.getElementById('review-score').value;
        const content = document.getElementById('review-content').value;
        
        // 새 리뷰 객체 생성 (프론트 단에서 바로 목록에 추가하기 위함)
        const newReview = {
            id: Date.now(),
            author: "나(현재 유저)", 
            score: parseInt(score),
            content: content,
            date: "방금 전"
        };

        // 배열 맨 앞에 새 리뷰 추가 후 다시 렌더링
        mockReviews.unshift(newReview);
        renderReviews(mockReviews);

        // 통계 숫자 살짝 업데이트 (시각적 효과)
        const totalElem = document.getElementById('stat-total-reviews');
        totalElem.innerText = parseInt(totalElem.innerText) + 1;

        // 폼 초기화 및 알림
        reviewForm.reset();
        alert("리뷰가 성공적으로 등록되었습니다! 🎉");
    });
});