// js/app.js

// 1. 백엔드 API 기본 주소 설정 (나중에 FastAPI 켜면 통신할 주소)
const BASE_URL = "http://localhost:8000";

// 2. 공통 API 호출 함수 (백엔드와 대화하는 전용 통신망)
async function apiFetch(endpoint, method = 'GET', body = null) {
    const url = `${BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json'
    };

    // 브라우저에 저장된 토큰이 있으면 신분증처럼 꺼내서 헤더에 붙임
    const token = localStorage.getItem('access_token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method: method,
        headers: headers
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API 호출 중 오류가 발생했습니다.');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// 3. 문지기 로직 (로그인 가드 및 로그아웃 처리)
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname;
    const token = localStorage.getItem('access_token');

    // [가드 1] 로그인 안 했는데 메인/상세/보고싶다 페이지로 몰래 들어오려 할 때
    // (login.html과 preferences.html은 예외로 둠)
    if (!currentPage.includes('login.html') && !currentPage.includes('preferences.html') && !token) {
        alert('로그인이 필요한 서비스입니다. 🔒');
        window.location.href = 'login.html';
        return; 
    }

    // [가드 2] 이미 로그인했는데 또 로그인 페이지로 들어왔을 때 -> 메인으로 보냄
    if (currentPage.includes('login.html') && token) {
        window.location.href = 'index.html';
        return;
    }

    // [기능] 네비게이션 바에 유저 이름(닉네임) 띄우기
    const greetingObj = document.getElementById('user-greeting');
    if (greetingObj) {
        const username = localStorage.getItem('username') || '게스트';
        greetingObj.innerText = `${username}님, 환영합니다! ✨`;
    }

    // [기능] 로그아웃 버튼 작동
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // 브라우저에서 토큰(신분증) 영구 삭제
            localStorage.removeItem('access_token');
            localStorage.removeItem('username');
            
            alert('안전하게 로그아웃 되었습니다. 👋');
            window.location.href = 'login.html';
        });
    }
});