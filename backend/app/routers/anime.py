from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, UserPreference
from app.schemas.anime import AnimeListResponse, AnimeDetailResponse
from app.core.deps import get_current_user
from app.services.jikan import (
    search_anime_sync,
    get_anime_detail_sync,
    cache_anime,
    get_cached_anime,
)

router = APIRouter(prefix="/anime", tags=["애니"])


@router.get("/recommend", response_model=AnimeListResponse)
def recommend_anime(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    맞춤 추천 API (로그인 필수)
    저장된 취향 설정(장르 + 평점 구간)으로 자동 검색
    """

    # 1) 유저 취향 설정 조회
    preference = (
        db.query(UserPreference)
        .filter(UserPreference.user_id == current_user.id)
        .first()
    )

    if not preference or not preference.genres:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="취향 설정을 먼저 해주세요. (장르, 평점 구간)",
        )

    # 2) Jikan API로 검색
    results = search_anime_sync(
        genres=preference.genres,
        score_min=preference.score_min,
        score_max=preference.score_max,
    )

    # 3) 검색 결과 캐싱
    for anime in results:
        cache_anime(db, anime)

    return {
        "success": True,
        "message": f"{len(results)}개의 추천 결과를 찾았습니다.",
        "data": results,
    }


@router.get("/search", response_model=AnimeListResponse)
def search_anime(
    genres: str = Query(..., description="장르 ID (쉼표 구분)", examples=["1,22,36"]),
    score_min: float = Query(1.0, ge=1.0, le=10.0, description="최소 평점"),
    score_max: float = Query(10.0, ge=1.0, le=10.0, description="최대 평점"),
    page: int = Query(1, ge=1, description="페이지 번호"),
    db: Session = Depends(get_db),
):
    """
    직접 검색 API (로그인 불필요)
    장르, 평점 구간, 페이지를 직접 지정해서 검색
    """

    # 1) 장르 문자열을 리스트로 변환
    try:
        genre_ids = [int(g.strip()) for g in genres.split(",")]
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="장르 ID는 숫자를 쉼표로 구분해야 합니다. (예: 1,22,36)",
        )

    # 2) 평점 범위 검사
    if score_min >= score_max:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최소 평점은 최대 평점보다 작아야 합니다.",
        )

    # 3) Jikan API 호출
    results = search_anime_sync(
        genres=genre_ids,
        score_min=score_min,
        score_max=score_max,
        page=page,
    )

    # 4) 결과 캐싱
    for anime in results:
        cache_anime(db, anime)

    return {
        "success": True,
        "message": f"{len(results)}개의 검색 결과를 찾았습니다.",
        "data": results,
    }


@router.get("/{mal_id}", response_model=AnimeDetailResponse)
def get_anime_detail(
    mal_id: int,
    db: Session = Depends(get_db),
):
    """
    작품 상세 API (로그인 불필요)
    캐시에 있으면 캐시 데이터 반환, 없으면 Jikan API 호출
    """

    # 1) 캐시 먼저 확인
    cached = get_cached_anime(db, mal_id)
    if cached:
        return {
            "success": True,
            "message": "작품 상세 정보 (캐시)",
            "data": cached,
        }

    # 2) 캐시에 없으면 Jikan API 호출
    detail = get_anime_detail_sync(mal_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="작품을 찾을 수 없습니다.",
        )

    # 3) 결과 캐싱
    cache_anime(db, detail)

    return {
        "success": True,
        "message": "작품 상세 정보",
        "data": detail,
    }