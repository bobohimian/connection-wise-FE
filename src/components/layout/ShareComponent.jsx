import React, { useState, useEffect } from 'react';
import apiService from '../../api';

export default function ShareComponent({ canvasId }) {
  const [sharedUsers, setSharedUsers] = useState([]);
  const [newUsername, setNewUsername] = useState('');
  const [permission, setPermission] = useState('read'); // 默认为只读权限
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取已分享用户列表
  const fetchSharedUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchSharedUserList(canvasId);
      setSharedUsers(data);
      setError('');
    } catch (err) {
      console.error('获取分享用户列表失败', err);
      setError('获取分享用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取分享用户列表
  useEffect(() => {
    if (canvasId) {
      fetchSharedUsers();
    }
  }, [canvasId]);

  // 添加新的分享
  const handleAddShare = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setError('请输入用户名');
      return;
    }

    try {
      setLoading(true);
      await apiService.shareCanvas({
        canvasId: canvasId,
        userName: newUsername,
        permission: permission
      });
      setNewUsername('');
      setPermission('read');
      setError('');
      fetchSharedUsers(); // 刷新列表
    } catch (err) {
      console.error('分享失败', err);
      setError('分享失败，请确认用户名是否正确');
    } finally {
      setLoading(false);
    }
  };

  // 更新分享权限
  const handleUpdatePermission = async (userId,canvasId, newPermission) => {
    try {
      setLoading(true);
      
      await apiService.updateShare({
        userId:userId,
        canvasId: canvasId,
        permission: newPermission,
      });
      fetchSharedUsers(); // 刷新列表
    } catch (err) {
      console.error('更新权限失败', err);
      setError('更新权限失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除分享
  const handleDeleteShare = async (userId) => {
    try {
      setLoading(true);
      await apiService.deleteShare(userId);
      fetchSharedUsers(); // 刷新列表
    } catch (err) {
      console.error('删除分享失败', err);
      setError('删除分享失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r bg-linear-to-r from-blue-500 via-cyan-500 to-teal-500 p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">分享管理</h2>
        <p className="opacity-80">邀请其他用户访问您的画布</p>
      </div>
      
      {/* 添加新分享表单 */}
      <form onSubmit={handleAddShare} className="px-8 flex flex-col space-y-4 mt-4 mb-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md animate-fadeIn">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="username" className="mb-2 text-sm font-medium text-gray-700">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="请输入用户名"
            className={`w-full py-3 px-4 border ${error && !newUsername ? "border-red-300 ring-1 ring-red-300" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition`}
            disabled={loading}
          />
        </div>
        
        <div>
          <label className="mb-2 text-sm font-medium text-gray-700 block">
            权限设置
          </label>
          <div className="flex items-center space-x-6 mt-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="permission"
                value="read"
                checked={permission === 'read'}
                onChange={() => setPermission('read')}
                className="mr-2 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-gray-700">只读</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="permission"
                value="edit"
                checked={permission === 'edit'}
                onChange={() => setPermission('edit')}
                className="mr-2 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-gray-700">编辑</span>
            </label>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center space-x-3 py-3 px-4 bg-cyan-500 rounded-lg text-white font-medium transition-colors hover:bg-cyan-400 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-gray-100 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>添加分享</span>
          )}
        </button>
      </form>

      {/* 已分享用户列表 */}
      <div className="px-8 pb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-800">已分享用户</h3>
        <div className="border rounded-lg overflow-hidden shadow-sm">
          <div className="bg-gray-100 px-4 py-3 font-medium flex border-b">
            <div className="flex-1 text-gray-700">用户名</div>
            <div className="w-24 text-center text-gray-700">权限</div>
            <div className="w-16 text-center text-gray-700">操作</div>
          </div>
          
          {loading && (
            <div className="p-6 text-center">
              <div className="inline-block h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-500">加载中...</p>
            </div>
          )}
          
          {!loading && sharedUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-900">暂无分享用户</p>
              <p className="mt-1 text-sm text-gray-500">添加用户以共享您的画布</p>
            </div>
          )}
          
          {!loading && sharedUsers.map((user) => (
            <div key={user.id} className="px-4 py-3 border-t flex items-center hover:bg-gray-50 transition-colors">
              <div className="flex-1 font-medium text-gray-800">{user.username}</div>
              <div className="w-24 text-center">
                <select
                  value={user.permission}
                  onChange={(e) => handleUpdatePermission(user.id, canvasId, e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  disabled={loading}
                >
                  <option value="view">只读</option>
                  <option value="edit">编辑</option>
                </select>
              </div>
              <div className="w-16 text-center">
                <button
                  onClick={() => handleDeleteShare(user.shareId)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                  disabled={loading}
                  aria-label="删除分享"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}