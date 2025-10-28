import React, { useState, useEffect, useCallback } from 'react';
import { getAllReports, deleteReport } from '../../../common/api/reportApi';
import AdminPagination from './AdminPagination';

function AdminReport() {
    const [reports, setReports] = useState([]);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [reportsError, setReportsError] = useState(null);
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [reportsPerPage, setReportsPerPage] = useState(10);
    const [totalReports, setTotalReports] = useState(0);

    const fetchReports = useCallback(async () => {
        setReportsLoading(true);
        try {
            const data = await getAllReports(currentReportPage, reportsPerPage);
            setReports(data.reports || []);
            setTotalReports(data.totalReports || 0);
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

    const handleDeleteReport = async (reportId) => {
        if (window.confirm(`정말로 신고 ID: ${reportId} 를 삭제하시겠습니까?`)) {
            try {
                await deleteReport(reportId);
                alert(`신고 ${reportId} 가 성공적으로 삭제되었습니다.`);
                fetchReports(); // 신고 목록 새로고침
            } catch (error) {
                alert(`신고 ${reportId} 삭제 처리 중 오류가 발생했습니다: ${error.message}`);
                console.error(`Error deleting report ${reportId}:`, error);
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
                <table>
                    <thead>
                        <tr>
                            <th>신고 ID</th>
                            <th>신고된 게시물 ID</th>
                            <th>신고된 댓글 ID</th>
                            <th>신고자 ID</th>
                            <th>신고된 사용자 ID</th>
                            <th>신고 내용</th>
                            <th>신고 타입</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.reportId}</td>
                                <td>{report.reportedPostId || 'N/A'}</td>
                                <td>{report.reportedCommentId || 'N/A'}</td>
                                <td>{report.reporterUserId}</td>
                                <td>{report.reportedUserId}</td>
                                <td>{report.reportContent}</td>
                                <td>{report.typeName}</td>
                                <td>
                                    <button onClick={() => handleDeleteReport(report.reportId)}>삭제</button>
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
