import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchPost, deletePost, likePost } = usePosts();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPost(id);
        setPost(postData);
      } catch (error) {
        console.error('Error loading post:', error);
        navigate('/posts');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id, fetchPost, navigate]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setDeleting(true);
      try {
        await deletePost(id);
        navigate('/posts');
      } catch (error) {
        console.error('Error deleting post:', error);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleLike = async () => {
    setLiking(true);
    try {
      const result = await likePost(id);
      setPost(prev => ({
        ...prev,
        likes: result.likeCount,
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLiking(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAuthor = user && post && user.id === post.author._id;
  const isLiked = user && post && post.likes.includes(user.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <p className="text-gray-600 mb-4">The post you're looking for doesn't exist.</p>
        <Link to="/posts" className="btn-primary">
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/posts" 
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← Back to Posts
        </Link>
      </div>

      <article className="card">
        <header className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <span>By {post.author?.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
                <span className="mx-2">•</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  post.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            {isAuthor && (
              <div className="flex space-x-2">
                <Link
                  to={`/posts/${post._id}/edit`}
                  className="btn-secondary text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose max-w-none mb-8">
          <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {post.content}
          </div>
        </div>

        <footer className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={liking || !user}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isLiked
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{post.likeCount || 0} likes</span>
              </button>
            </div>

            <div className="text-sm text-gray-500">
              Last updated: {formatDate(post.updatedAt)}
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PostDetail;