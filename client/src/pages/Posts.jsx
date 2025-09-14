import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePosts } from '../contexts/PostContext';

const Posts = () => {
  const { posts, loading, fetchPosts } = usePosts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const loadPosts = async () => {
      const data = await fetchPosts(currentPage, 10, searchTerm);
      if (data) {
        setPagination({
          totalPages: data.totalPages,
          currentPage: data.currentPage,
          total: data.total,
        });
      }
    };
    loadPosts();
  }, [currentPage, searchTerm, fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">All Posts</h1>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 input-field"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms.' : 'Be the first to create a post!'}
          </p>
          <Link to="/create-post" className="btn-primary">
            Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link 
                      to={`/posts/${post._id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>By {post.author?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  post.isPublished 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 line-clamp-3">
                {post.content}
              </p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {post.likeCount || 0} likes
                  </span>
                </div>
                <Link
                  to={`/posts/${post._id}`}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {pagination.totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;