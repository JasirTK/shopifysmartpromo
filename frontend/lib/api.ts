import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

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
        const response = await axios.get(`${API_BASE_URL}/public/all-content`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all content:", error);
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
