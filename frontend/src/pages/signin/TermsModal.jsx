import React from 'react';
import '../../asset/css/SignIn.css';

export default function TermsModal({ onClose }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-panel" style={{ backgroundColor: "#000", color: "#fff" }}>
        <div className="modal-head" style={{ borderBottom: "1px solid #333" }}>
          <strong>이용약관</strong>
          <button className="modal-close" onClick={onClose}>닫기</button>
        </div>

        <div className="modal-body">
          <ol>
            <li>
              <strong>서비스 목적</strong><br />
              · 본 사이트는 사용자가 업로드한 옷 사진을 인공지능으로 분석하여 의류의 카테고리, 색상, 소재, 스타일 정보를 분류하고,<br />
              &nbsp;&nbsp;&nbsp;이를 기반으로 추천 기능을 제공합니다.<br />
              · 추천과 같은 결과물이나 실제 구매 및 스타일링 선택은 전적으로 사용자의 책임입니다.
            </li>
            <br />
            <li>
              <strong>지적재산권</strong><br />
              · 사이트에서 제공하는 서비스, 모델, 알고리즘, 데이터는 본 사이트에 귀속되며,<br />
              &nbsp;&nbsp;&nbsp;무단 복제, 배포, 상업적 이용을 금합니다.
            </li>
            <br />
            <li>
              <strong>이용자의 권리와 의무</strong><br />
              · 사용자는 타인의 권리를 침해하지 않으며, 명확한 목적이나 허락 없이 이미지 및 AI 분석 데이터를 타인에게 유출해서는 안 됩니다.<br />
              · 계정 정보는 사용자가 직접 관리하며, 분실 또는 도용에 대한 책임은 사용자 본인에게 있습니다.
            </li>
            <br />
            <li>
              <strong>서비스의 변경 및 중단</strong><br />
              · 본 사이트는 서비스 제공을 위해 기능을 개선·수정할 수 있으며,<br />
              &nbsp;&nbsp;&nbsp;필요 시 사전 공지 후 종료할 수 있습니다.
            </li>
            <br />
            <li>
              <strong>면책</strong><br />
              · 본 사이트는 서버 및 통신 장애, 천재지변, 환경적, 정책적 문제로 인한 서비스 중단에 대해 책임을 지지 않습니다.<br />
              · 분석 결과 및 추천은 참고용이며, 스타일링은 전적으로 사용자의 판단과 책임입니다.
            </li>
            <br />
            <li>
              <strong>분쟁 해결</strong><br />
              · 본 약관과 관련된 분쟁은 서비스 제공자의 소재지 관할 법원에 따릅니다.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
