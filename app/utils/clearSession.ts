import { supabase } from '~/lib/supabase/client';

export async function clearAllSessions() {
  try {
    // Supabase 로그아웃
    await supabase.auth.signOut();
    
    // localStorage 항목들 삭제
    const itemsToRemove = [
      'supabase.auth.token',
      'bolt_profile',
      'supabase_connection',
      'supabaseCredentials',
      'github_connection',
      // Supabase Auth가 사용하는 키들
      ...Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase')
      )
    ];
    
    itemsToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // sessionStorage 초기화
    sessionStorage.clear();
    
    // IndexedDB 초기화 (채팅 기록 삭제)
    if (typeof indexedDB !== 'undefined') {
      try {
        // boltHistory 데이터베이스 완전 삭제
        await indexedDB.deleteDatabase('boltHistory');
        console.log('Chat history database cleared');
      } catch (dbError) {
        console.error('Error clearing IndexedDB:', dbError);
      }
    }
    
    // 쿠키 삭제
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('All sessions and storage cleared successfully');
    
    // 페이지 새로고침
    window.location.href = '/';
  } catch (error) {
    console.error('Error clearing sessions:', error);
  }
}

// 개발 환경에서만 window 객체에 노출
if (process.env.NODE_ENV === 'development') {
  (window as any).clearAllSessions = clearAllSessions;
}