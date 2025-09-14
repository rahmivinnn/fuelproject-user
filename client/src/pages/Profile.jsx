import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePosts } from '../contexts/PostContext';

const Profile = () => {
  const { user } = useAuth();
  const { posts, fetchPosts } = usePosts();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPosts = async () => {
      try {
        await fetchPosts(1, 20); // Fetch more posts for user profile
        // Filter posts by current user
        const filtered = posts.filter(post => post.author._id === user.id);
        setUserPosts(filtered);
      } catch (error) {
        console.error('Error loading user posts:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserPosts();
  }, [fetchPosts, posts, user.id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stats = {
    totalPosts: userPosts.length,
    publishedPosts: userPosts.filter(post => post.isPublished).length,
    draftPosts: userPosts.filter(post => !post.isPublished).length,
    totalLikes: userPosts.reduce((sum, post) => sum + (post.likeCount || 0), 0),
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account and view your posts.</p>
      </div>

      {/* User Info */}
      <div className="card mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-600">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">{stats.totalPosts}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.publishedPosts}</div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{stats.draftPosts}</div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600 mb-1">{stats.totalLikes}</div>
          <div className="text-sm text-gray-600">Total Likes</div>
        </div>
      </div>

      {/* User Posts */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Your Posts</h3>
          <a
            href="/create-post"
            className="btn-primary text-sm"
          >
            Create New Post
          </a>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : userPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h4>
            <p className="text-gray-600 mb-4">Start sharing your thoughts with the world!</p>
            <a href="/create-post" className="btn-primary">
              Create Your First Post
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-900">
                    <a
                      href={`/posts/${post._id}`}
                      className="hover:text-primary-600 transition-colors"
                    >
                      {post.title}
                    </a>
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    post.isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>{formatDate(post.createdAt)}</span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {post.likeCount || 0} likes
                    </span>
                  </div>
                  <a
                    href={`/posts/${post._id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Post →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;