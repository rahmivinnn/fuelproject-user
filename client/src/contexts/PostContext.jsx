import { createContext, useContext, useReducer } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostContext = createContext();

const postReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload),
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

export const PostProvider = ({ children }) => {
  const [state, dispatch] = useReducer(postReducer, initialState);

  const fetchPosts = async (page = 1, limit = 10, search = '') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await axios.get('/api/posts', {
        params: { page, limit, search },
      });
      dispatch({ type: 'SET_POSTS', payload: response.data.posts });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch posts';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
    }
  };

  const fetchPost = async (id) => {
    try {
      const response = await axios.get(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch post';
      toast.error(message);
      throw error;
    }
  };

  const createPost = async (postData) => {
    try {
      const response = await axios.post('/api/posts', postData);
      dispatch({ type: 'ADD_POST', payload: response.data });
      toast.success('Post created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
      throw error;
    }
  };

  const updatePost = async (id, postData) => {
    try {
      const response = await axios.put(`/api/posts/${id}`, postData);
      dispatch({ type: 'UPDATE_POST', payload: response.data });
      toast.success('Post updated successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
      throw error;
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/posts/${id}`);
      dispatch({ type: 'DELETE_POST', payload: id });
      toast.success('Post deleted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete post';
      toast.error(message);
      throw error;
    }
  };

  const likePost = async (id) => {
    try {
      const response = await axios.post(`/api/posts/${id}/like`);
      const updatedPost = state.posts.find(post => post._id === id);
      if (updatedPost) {
        updatedPost.likes = response.data.likeCount;
        dispatch({ type: 'UPDATE_POST', payload: updatedPost });
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to like post';
      toast.error(message);
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    clearError,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};