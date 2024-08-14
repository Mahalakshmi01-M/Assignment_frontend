document.getElementById('login-form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            window.location.href = '/google-login';
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});
