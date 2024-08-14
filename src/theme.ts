// Manage theme-related functionality
const toggleTheme = () => {
    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', currentTheme === 'light');
    document.body.classList.toggle('light', currentTheme === 'dark');
    localStorage.setItem('theme', currentTheme === 'light' ? 'dark' : 'light');
};

document.getElementById('toggle-theme')?.addEventListener('click', toggleTheme);
