// js/login.js

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 탭 전환 로직 ---
    const tabLogin = document.getElementById('tab-login');
    const tabSignup = document.getElementById('tab-signup');
    const formLogin = document.getElementById('login-form');
    const formSignup = document.getElementById('signup-form');
    
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        formLogin.classList.remove('hidden-form');
        formSignup.classList.add('hidden-form');
    });

    tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        formSignup.classList.remove('hidden-form');
        formLogin.classList.add('hidden-form');
    });

    // --- 2. 유효성 검사 (입력 확인) 로직 ---
    const signupId = document.getElementById('signup-id');
    const signupNickname = document.getElementById('signup-nickname');
    const signupPw = document.getElementById('signup-pw');
    const signupPwConfirm = document.getElementById('signup-pw-confirm');
    const signupGender = document.getElementById('signup-gender');
    const signupAge = document.getElementById('signup-age');

    // 입력창 아래에 빨간 에러 메시지를 띄우는 함수
    function showError(element, message) {
        clearError(element); // 기존 에러 지우기
        element.style.borderColor = '#ff6b6b';
        element.style.boxShadow = '0 0 10px rgba(255, 107, 107, 0.4)';
        
        const errorText = document.createElement('div');
        errorText.className = 'error-text';
        errorText.style.color = '#ff6b6b';
        errorText.style.fontSize = '0.8rem';
        errorText.style.fontWeight = 'bold';
        errorText.style.marginTop = '8px';
        errorText.style.marginLeft = '4px';
        errorText.innerText = `* ${message}`;
        
        element.parentElement.appendChild(errorText);
    }

    // 에러 메시지를 초기화하는 함수
    function clearError(element) {
        element.style.borderColor = '';
        element.style.boxShadow = '';
        const existingError = element.parentElement.querySelector('.error-text');
        if (existingError) existingError.remove();
    }

    // 사용자가 다시 입력하기 시작하면 빨간 테두리와 에러 메시지 숨기기
    [signupId, signupNickname, signupPw, signupPwConfirm, signupGender, signupAge].forEach(input => {
        input.addEventListener('input', () => clearError(input));
        input.addEventListener('change', () => clearError(input));
    });

    // STEP 1 검사
    function validateStep1() {
        let isValid = true;

        if (signupId.value.trim().length < 4) {
            showError(signupId, '아이디는 4자 이상 입력해주세요.');
            isValid = false;
        }
        if (signupNickname.value.trim().length < 2) {
            showError(signupNickname, '닉네임은 2자 이상 입력해주세요.');
            isValid = false;
        }
        if (signupPw.value.length < 6) {
            showError(signupPw, '비밀번호는 6자 이상 입력해주세요.');
            isValid = false;
        } else if (signupPw.value !== signupPwConfirm.value) {
            showError(signupPwConfirm, '비밀번호가 일치하지 않습니다.');
            isValid = false;
        }

        return isValid; // 전부 통과하면 true 반환
    }

    // STEP 2 검사
    function validateStep2() {
        let isValid = true;

        if (signupGender.value === '') {
            showError(signupGender, '성별을 선택해주세요.');
            isValid = false;
        }
        if (signupAge.value === '') {
            showError(signupAge, '연령대를 선택해주세요.');
            isValid = false;
        }

        return isValid;
    }

    // --- 3. 단계 이동 로직 ---
    const steps = document.querySelectorAll('.signup-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.btn-next');
    const prevBtns = document.querySelectorAll('.btn-prev');
    let currentStep = 0;

    function updateStep(newStep) {
        steps[currentStep].classList.add('hidden-step');
        stepIndicators[currentStep].classList.remove('active-step');
        
        currentStep = newStep;
        
        steps[currentStep].classList.remove('hidden-step');
        stepIndicators[currentStep].classList.add('active-step');
    }

    // '다음 단계로' 버튼 클릭 시
    nextBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            let canGoNext = false;

            if (index === 0) {
                canGoNext = validateStep1(); // STEP 1 통과 여부
            } else if (index === 1) {
                canGoNext = validateStep2(); // STEP 2 통과 여부
            }

            // 통과했고, 마지막 단계가 아니라면 화면 넘기기
            if (canGoNext && currentStep < steps.length - 1) {
                updateStep(currentStep + 1);
            }
        });
    });

    // '이전' 버튼 클릭 시
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                updateStep(currentStep - 1);
            }
        });
    });


    
// --- js/login.js (기존 코드 맨 아래에 추가) ---

    // 로그인 폼 제출(버튼 클릭) 시 진짜로 넘어가게 만들기
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault(); // 새로고침 방지
        
        const userId = document.getElementById('login-id').value;
        
        // 1. 브라우저 저장소(localStorage)에 가짜 토큰과 아이디 저장
        localStorage.setItem('access_token', 'fake-jwt-token-12345');
        localStorage.setItem('username', userId);
        
        // 2. 환영 인사 띄우고 메인 화면으로 자동 이동
        alert(`${userId}님, 환영합니다! 🍃`);
        window.location.href = 'index.html'; 
    });


});