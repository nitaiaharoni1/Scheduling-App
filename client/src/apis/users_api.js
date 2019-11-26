import axios from 'axios'

export const loginApi = async (username, password, checkbox) => {
    try {
        const res = await axios.post(`/users/login`, {username, password, checkbox});
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const signupApi = async (firstName, lastName, username, password, email, organization) => {
    try {
        const res = await axios.post(`/users/signup`, {firstName, lastName, username, password, email, organization});
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const logoutApi = async () => {
    try {
        const res = await axios.post(`/users/logout`);
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const authApi = async () => {
    try {
        const res = await axios.get(`/users/auth`);
        if (res.status === 200) {
            return res.data;
        } else {
            return null;
        }
    } catch (e) {
        return null;
    }
};