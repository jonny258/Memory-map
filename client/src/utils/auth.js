import decode from 'jwt-decode';

class AuthService {

  isClientSide() {
    return typeof window !== 'undefined';
  }

  getProfile() {
    const token = this.getToken();
    if (token) {
      try {
        return decode(token);
      } catch (error) {
        console.error("Error decoding the token:", error);
        return null;
      }
    }
    return null;
  }
  

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
  if (this.isClientSide()) {
    return localStorage.getItem('id_token');
  }
  return null;
}

login(idToken) {
  if (this.isClientSide()) {
    localStorage.setItem('id_token', idToken);
    //window.location.assign('/');
  }
}

logout() {
  if (this.isClientSide()) {
    localStorage.removeItem('id_token');
    // window.location.assign('/');
  }
}
}

const authService = new AuthService();
export default authService;
