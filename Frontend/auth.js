document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form');
    authForm.addEventListener('submit', handleAuth);
});

async function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const isLogin = window.location.pathname.includes('login');

    try {
        const response = await fetch(`/api/${isLogin ? 'login' : 'register'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            window.location.href = 'dashboard.html';
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Authentication error:', error);
        alert('An error occurred during authentication. Please try again.');
    }
}