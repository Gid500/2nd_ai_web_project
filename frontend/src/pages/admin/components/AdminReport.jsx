import React, { useState, useEffect, useCallback } from 'react';
import { getAllReports, updateReportStatus } from '../../../common/api/reportApi';
import { deleteComment } from '../../comm/api/commCommentApi';
import AdminPagination from './AdminPagination';
import '../../admin/Admin.css'; // Admin.css import

function AdminReport() {
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [reportsError, setReportsError] = useState(null);
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [reportsPerPage, setReportsPerPage] = useState(10);
    const [totalReports, setTotalReports] = useState(0);

    const getReportStatusText = (status) => {
        switch (status) {
            case 0: return '대기중';
            case 1: return '거절됨';
            case 2: return '승인됨 (처리 완료)';
            case 3: return '게시물 삭제됨 (처리 완료)';
            default: return '알 수 없음';
        }
    };

    const fetchReports = useCallback(async () => {
        setReportsLoading(true);
        try {
            const data = await getAllReports(currentReportPage, reportsPerPage);
            // API 응답이 직접 배열인 경우를 처리
            if (Array.isArray(data)) {
                setReports(data);
                setTotalReports(data.length);
            } else { // 기존처럼 객체 안에 reports 배열이 있는 경우
                setReports(data.reports || []);
                setTotalReports(data.totalReports || 0);
            }
            setReportsError(null);
        } catch (err) {
            setReportsError(err);
            setReports([]);
            setTotalReports(0);
        } finally {
            setReportsLoading(false);
        }
    }, [currentReportPage, reportsPerPage]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    const handleUpdateReportStatus = async (reportId, newStatus, reportedCommentId) => {
        const actionText = newStatus === 2 ? '승인' : '거절';
        if (window.confirm(`정말로 신고 ID: ${reportId} 를 ${actionText}하시겠습니까?`)) {
            try {
                // 댓글 신고인 경우, 승인 시 댓글 먼저 삭제
                if (newStatus === 2 && reportedCommentId) {
                    await deleteComment(reportedCommentId);
                    alert(`댓글 ID: ${reportedCommentId} 가 성공적으로 삭제되었습니다.`);
                }
                // 신고 상태 업데이트
                await updateReportStatus(reportId, newStatus);
                alert(`신고 ${reportId} 가 성공적으로 ${actionText}되었습니다.`);
                fetchReports(); // 신고 목록 새로고침
            } catch (error) {
                alert(`신고 ${reportId} ${actionText} 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error updating report status ${reportId}:`, error);
            }
        }
    };

    const paginateReports = (pageNumber) => setCurrentReportPage(pageNumber);

    const handleReportsPerPageChange = (e) => {
        setReportsPerPage(parseInt(e.target.value));
        setCurrentReportPage(1); // 페이지당 신고 수 변경 시 1페이지로 리셋
    };

    if (reportsLoading) {
        return <p>신고 정보를 불러오는 중...</p>;
    }

    if (reportsError) {
        return <p>신고 목록을 불러오는 중 오류가 발생했습니다: {reportsError.message}</p>;
    }

    return (
        <section style={{ marginTop: '40px' }}>
            <h2>신고 관리</h2>
            <div className="comm-posts-per-page-selector">
                <label>페이지당 신고 수:</label>
                <select value={reportsPerPage} onChange={handleReportsPerPageChange}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={40}>40</option>
                </select>
            </div>
            {reports.length > 0 ? (
                <table className="admin-table"> {/* className 추가 */}
                    <thead>
                        <tr>
                            <th>신고 ID</th>
                            <th>신고된 게시물 ID</th>
                            <th>신고된 게시물 제목</th>
                            <th>신고된 게시물 내용</th>
                            <th>신고된 댓글 ID</th>
                            <th>신고된 댓글 내용</th>
                            <th>신고자 ID</th>
                            <th>신고된 사용자 ID</th>
                            <th>신고 내용</th>
                            <th>신고 타입</th>
                            <th>신고 상태</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.reportId}</td>
                                <td>{report.reportedPostId || 'N/A'}</td>
                                <td>{report.reportedPostTitle || 'N/A'}</td>
                                <td className="admin-table-content-cell"><textarea readOnly className="admin-report-textarea" value={report.reportedPostContent || 'N/A'} /></td>
                                <td>{report.reportedCommentId || 'N/A'}</td>
                                <td className="admin-table-content-cell"><textarea readOnly className="admin-report-textarea" value={report.reportedCommentText || 'N/A'} /></td>
                                <td>{report.reporterUserId}</td>
                                <td>{report.reportedUserId}</td>
                                <td>{report.reportContent}</td>
                                <td>{report.typeName}</td>
                                <td>{getReportStatusText(report.reportStatus)}</td>
                                <td>
                                    <button
                                        onClick={() => handleUpdateReportStatus(report.reportId, 2, report.reportedCommentId)}
                                        disabled={report.reportStatus === 2 || report.reportStatus === 3}
                                    >
                                        승인
                                    </button>
                                    <button
                                        onClick={() => handleUpdateReportStatus(report.reportId, 1)}
                                        disabled={report.reportStatus === 2 || report.reportStatus === 3}
                                    >
                                        거절
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>등록된 신고가 없습니다.</p>
            )}
            <AdminPagination
                postsPerPage={reportsPerPage}
                totalPosts={totalReports}
                onPageChange={paginateReports}
                currentPage={currentReportPage}
            />
        </section>
    );
}

export default AdminReport;
