import React, { useState } from 'react'; // useState 추가
import { useAuth } from '../../../common/hook/useAuth';
import './PostDetail.css';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
// CommentList와 CommentForm 컴포넌트 import
import CommentList from './CommentList'; // 경로 수정
import CommentForm from './CommentForm'; // 경로 수정
import { addComment, updateComment, deleteComment } from '../api/commCommentApi'; // commCommentApi 임포트

// 백엔드 기본 URL (환경 변수 또는 설정 파일에서 가져오는 것이 좋지만, 일단 하드코딩)
const BACKEND_BASE_URL = 'http://localhost:8080';

const PostDetail = ({ post, onBackToList, onEdit, onDelete, comments, fetchComments }) => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate(); // useNavigate 훅 사용
    const [editingComment, setEditingComment] = useState(null); // 댓글 수정 상태 관리

    if (!post) {
        return <p>게시글을 찾을 수 없습니다.</p>;
    }

    const decodedContent = post.postContent || '';

    const handleEditClick = () => {
        onEdit(post); // useCommPage의 handleEditPost 호출
    };

    const handleDeleteClick = () => {
        onDelete(post.postId); // useCommPage의 handleDeletePost 호출
    };

    // 댓글 추가/수정 핸들러
    const handleAddOrUpdateComment = async (commentData) => {
        try {
            if (commentData.commentId) { // commentId가 있으면 수정
                await updateComment(commentData.commentId, { comment: commentData.comment, userId: user.userId });
            } else { // 없으면 추가
                await addComment({ postId: post.postId, comment: commentData.comment, userId: user.userId });
            }
            fetchComments(post.postId); // 댓글 목록 새로고침
            setEditingComment(null); // 수정 모드 종료
        } catch (error) {
            console.error('Error adding/updating comment:', error);
            alert('댓글 작성/수정 중 오류가 발생했습니다.');
        }
    };

    // 댓글 수정 시작 핸들러
    const handleEditComment = (commentId) => {
        const commentToEdit = comments.find(c => c.commentId === commentId);
        setEditingComment(commentToEdit);
    };

    // 댓글 삭제 핸들러
    const handleDeleteComment = async (commentId) => {
        if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
            try {
                await deleteComment(commentId);
                fetchComments(post.postId); // 댓글 목록 새로고침
            } catch (error) {
                console.error('Error deleting comment:', error);
                alert('댓글 삭제 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="post-detail-container">
            <h2 className="post-detail-title">
                {post.isNotice && <span className="post-detail-notice-tag">[공지]</span>}
                {post.postTitle}
            </h2>
            <p className="post-detail-meta-info">작성자: {post.userNickname || post.userId}</p> {/* userNickname 사용 */}
            <p className="post-detail-meta-info">작성일: {new Date(post.createdDate).toLocaleString()}</p>
            {post.updatedDate && new Date(post.updatedDate).getTime() !== new Date(post.createdDate).getTime() && (
                <p className="post-detail-meta-info">수정일: {new Date(post.updatedDate).toLocaleString()}</p>
            )}
            <div className="post-detail-content-section">
                <h3>내용:</h3>
                <p>{decodedContent}</p>
            </div>
            {post.files && post.files.length > 0 && (
                <div className="post-detail-files-section">
                    <h3>첨부 파일:</h3>
                    <ul className="post-detail-file-list">
                        {post.files.map(file => (
                            <li key={file.fileId} className="post-detail-file-item">
                                {/* 이미지가 맞다면 <img> 태그로 표시 */}
                                {file.fileType && file.fileType.startsWith('image/') ? (
                                    <img src={`${BACKEND_BASE_URL}${file.imgUrl}`} alt={file.uploadName} className="post-detail-file-image" />
                                ) : (
                                    // 이미지가 아니면 기존처럼 링크로 표시
                                    <a href={`${BACKEND_BASE_URL}${file.imgUrl}`} target="_blank" rel="noopener noreferrer">{file.uploadName}</a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="post-detail-actions">
                <button onClick={onBackToList}>목록으로 돌아가기</button>
                {(isAdmin || (user && user.userId === post.userId)) && (
                    <> 
                        <button onClick={handleEditClick}>수정</button>
                        <button onClick={handleDeleteClick}>삭제</button>
                    </>
                )}
            </div>

            {/* 댓글 섹션 추가 */}
            <div className="comment-section">
                {user && ( // 로그인한 사용자만 댓글 작성/수정 폼 표시
                    <CommentForm
                        postId={post.postId}
                        onAddComment={handleAddOrUpdateComment}
                        initialComment={editingComment}
                        onCancelEdit={() => setEditingComment(null)}
                    />
                )}
                <CommentList
                    comments={comments}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment}
                    currentUserId={user?.userId} // 현재 로그인한 사용자 ID 전달
                    isAdmin={isAdmin}
                />
            </div>
        </div>
    );
};

export default PostDetail;
