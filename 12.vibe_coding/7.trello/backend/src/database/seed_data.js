
import { uid } from '../utils/helpers.js';
import { openDb, run, get } from './db.js';

export async function generateSampleData(db, userId, workspaceId, type = 1) {
  // Helper to format date
  const fmt = (d) => d.toISOString().split('T')[0];
  const today = new Date();
  
  const addDays = (d, n) => {
      const newD = new Date(d);
      newD.setDate(newD.getDate() + n);
      return newD;
  };

  // --- Project #1 (English) ---
  const createProject1 = async () => {
      const projId = uid('p');
      await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)', 
        [projId, workspaceId, 'Sample Project #1', 'generated with realistic dates', userId]);
        
      const cols = [
        { id: uid('c'), name: 'Todo', ord: 1 },
        { id: uid('c'), name: 'Doing', ord: 2 },
        { id: uid('c'), name: 'Done', ord: 3 },
      ];
      for (const c of cols) {
          await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [c.id, projId, c.name, c.ord]);
      }

      const tasks = [
        { title: 'Market Research', desc: 'Analyze current market trends and potential user base demographics.', start: addDays(today, -10), end: addDays(today, -5), col: 2, prio: 'medium' },
        { title: 'Competitor Analysis', desc: 'Review features and pricing of top 5 competitors.', start: addDays(today, -8), end: addDays(today, -4), col: 2, prio: 'low' },
        { title: 'Design System', desc: 'Create atomic design components (buttons, inputs) in Figma.', start: addDays(today, -2), end: addDays(today, 3), col: 1, prio: 'high' },
        { title: 'API Development', desc: 'Implement RESTful endpoints for user authentication and projects.', start: addDays(today, -1), end: addDays(today, 5), col: 1, prio: 'high' },
        { title: 'Frontend Integration', desc: 'Connect React frontend with the new backend APIs.', start: addDays(today, 1), end: addDays(today, 7), col: 0, prio: 'high' },
        { title: 'User Testing', desc: 'Conduct usability sessions with 5 beta testers.', start: addDays(today, 5), end: addDays(today, 10), col: 0, prio: 'medium' },
        { title: 'Launch Prep', desc: 'Finalize documentation and prepare marketing assets.', start: addDays(today, 10), end: addDays(today, 15), col: 0, prio: 'low' },
      ];

      let ord = 1;
      for (const t of tasks) {
        await run(db, `
          INSERT INTO tasks(id, project_id, column_id, title, description, start_date, end_date, priority, status, ord, created_by)
          VALUES (?,?,?,?,?,?,?,?,?,?,?)
        `, [uid('t'), projId, cols[t.col].id, t.title, t.desc, fmt(t.start), fmt(t.end), t.prio, 'open', ord++, userId]);
      }
      return projId;
  };

  // --- Project #2 (Korean, 4 Columns) ---
  const createProject2 = async () => {
    const projId = uid('p');
    await run(db, 'INSERT INTO projects(id,workspace_id,name,description,created_by) VALUES (?,?,?,?,?)', 
      [projId, workspaceId, 'Sample Project #2 (Marketing)', '마케팅 캠페인 런칭 준비 (Korean Sample)', userId]);

    // 4 Columns
    const cols = [
      { id: uid('c'), name: '기획 (Planning)', ord: 1 },
      { id: uid('c'), name: '제작 (Creative)', ord: 2 },
      { id: uid('c'), name: '검토 (Review)', ord: 3 },
      { id: uid('c'), name: '배포 (Publish)', ord: 4 },
    ];
    for (const c of cols) {
        await run(db, 'INSERT INTO columns(id,project_id,name,ord) VALUES (?,?,?,?)', [c.id, projId, c.name, c.ord]);
    }

    // More items
    const tasks = [
        // 배포 (Col 3) - Doneish
        { title: '1분기 성과 분석', desc: '지난 분기 마케팅 성과 KPI 분석 보고서 작성', start: addDays(today, -20), end: addDays(today, -15), col: 3, prio: 'high' },
        { title: '타겟 오디언스 정의', desc: '주 타겟 고객층 연령대 및 관심사 데이터 확보', start: addDays(today, -18), end: addDays(today, -14), col: 3, prio: 'medium' },

        // 검토 (Col 2)
        { title: '랜딩 페이지 시안 검토', desc: '디자인팀에서 전달준 시안 A/B안 비교 및 피드백', start: addDays(today, -5), end: addDays(today, -1), col: 2, prio: 'high' },
        { title: '광고 문구 교정', desc: '메인 카피 및 서브 카피 오타 검수 및 톤앤매너 확인', start: addDays(today, -3), end: addDays(today, 0), col: 2, prio: 'low' },

        // 제작 (Col 1)
        { title: '카드뉴스 제작', desc: '인스타그램 및 페이스북용 홍보 카드뉴스 5종 디자인', start: addDays(today, -2), end: addDays(today, 2), col: 1, prio: 'medium' },
        { title: '프로모션 영상 편집', desc: '15초/30초 버전 숏폼 영상 컷편집 및 자막 작업', start: addDays(today, -1), end: addDays(today, 4), col: 1, prio: 'high' },
        { title: '이메일 뉴스레터 작성', desc: '구독자 대상 신규 캠페인 안내 HTML 메일 템플릿 코딩', start: addDays(today, 0), end: addDays(today, 3), col: 1, prio: 'low' },

        // 기획 (Col 0)
        { title: '인플루언서 리스트업', desc: '뷰티/패션 카테고리 마이크로 인플루언서 30명 리스트 확보', start: addDays(today, 2), end: addDays(today, 5), col: 0, prio: 'medium' },
        { title: 'SNS 광고 집행 계획안', desc: '예산 500만원 기준 채널별 예산 배분 및 ROAS 예측', start: addDays(today, 3), end: addDays(today, 7), col: 0, prio: 'high' },
        { title: '바이럴 마케팅 전략 수립', desc: '커뮤니티 및 카페 바이럴 침투 시나리오 작성', start: addDays(today, 5), end: addDays(today, 10), col: 0, prio: 'medium' },
        { title: '오프라인 팝업 기획', desc: '성수동 팝업스토어 컨셉 도출 및 대관처 문의', start: addDays(today, 10), end: addDays(today, 20), col: 0, prio: 'low' },
    ];

    let ord = 1;
    for (const t of tasks) {
      await run(db, `
        INSERT INTO tasks(id, project_id, column_id, title, description, start_date, end_date, priority, status, ord, created_by)
        VALUES (?,?,?,?,?,?,?,?,?,?,?)
      `, [uid('t'), projId, cols[t.col].id, t.title, t.desc, fmt(t.start), fmt(t.end), t.prio, 'open', ord++, userId]);
    }
    return projId;
  };

  // Decide which to create based on type
  // type 1: Project #1 (English)
  // type 2: Project #2 (Korean)
  let projectId;
  if (type === 2) {
      projectId = await createProject2();
  } else {
      projectId = await createProject1();
  }
  
  return { projectId };
}
