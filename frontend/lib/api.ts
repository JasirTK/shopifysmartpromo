import axios from 'axios';
import Cookies from 'js-cookie';

// Smart URL handling: Ensure we always have /api at the end, but don't duplicate it.
const getBaseUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
    // Remove trailing slash if present
    if (url.endsWith('/')) url = url.slice(0, -1);
    // Append /api if not present
    if (!url.endsWith('/api')) url += '/api';
    return url;
};
const API_BASE_URL = getBaseUrl();

const getAuthHeaders = () => {
    const token = Cookies.get('admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPublicContent = async (key: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public/content/${key}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching content for ${key}:`, error);
        return null;
    }
};

export const getAllContent = async () => {
    try {
        // Timeout after 2.5s to fallback to default content (avoids Render cold-start hang)
        const response = await axios.get(`${API_BASE_URL}/public/all-content`, { timeout: 2500 });
        return response.data;
    } catch (error) {
        console.warn("API unavailable or slow (using defaults):", error);
        return [];
    }
}

export const updateContent = async (key: string, content: any) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/admin/content/${key}`, { content }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error(`Error updating content for ${key}:`, error);
        throw error;
    }
};

export const sendChatMessage = async (sessionId: string, message: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat/message`, {
            session_id: sessionId,
            message,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

// Upload file
export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
};
