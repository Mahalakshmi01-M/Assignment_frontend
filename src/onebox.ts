document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('toggle-theme')!;
    const emailContainer = document.getElementById('emails')!;
    const replyBox = document.getElementById('reply-box')!;
    const replyBody = document.getElementById('reply-body') as HTMLTextAreaElement;
    const sendReplyBtn = document.getElementById('send-reply')!;

    let currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
        document.body.className = currentTheme;
        localStorage.setItem('theme', currentTheme);
    });

    const fetchEmails = async () => {
        try {
            const response = await fetch('/onebox/list');
            const emails = await response.json();
            
            emailContainer.innerHTML = emails.map((email: any) => `
                <div class="email-item" data-id="${email.thread_id}">
                    <h3>${email.subject}</h3>
                    <p>${email.snippet}</p>
                    <button class="delete-btn">Delete</button>
                    <button class="reply-btn">Reply</button>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error fetching emails:', error);
        }
    };

    emailContainer.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement;

        if (target.classList.contains('delete-btn')) {
            const threadId = (target.closest('.email-item') as HTMLElement).dataset.id;
            try {
                await fetch(`/onebox/${threadId}`, { method: 'DELETE' });
                fetchEmails();
            } catch (error) {
                console.error('Error deleting email:', error);
            }
        }
        
        if (target.classList.contains('reply-btn')) {
            replyBox.style.display = 'block';
            replyBox.dataset.threadId = (target.closest('.email-item') as HTMLElement).dataset.id!;
        }
    });

    sendReplyBtn.addEventListener('click', async () => {
        const threadId = replyBox.dataset.threadId!;
        try {
            const response = await fetch(`/reply/${threadId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'your-email@example.com',
                    to: 'recipient@example.com',
                    subject: 'Reply Subject',
                    body: replyBody.value
                })
            });

            if (response.ok) {
                replyBox.style.display = 'none';
                fetchEmails();
            } else {
                alert('Reply failed');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            alert('An error occurred');
        }
    });

    document.addEventListener('keydown', async (e) => {
        if (e.key === 'D') {
            const selectedEmail = document.querySelector('.email-item.selected') as HTMLElement;
            if (selectedEmail) {
                const threadId = selectedEmail.dataset.id!;
                try {
                    await fetch(`/onebox/${threadId}`, { method: 'DELETE' });
                    fetchEmails();
                } catch (error) {
                    console.error('Error deleting email:', error);
                }
            }
        }

        if (e.key === 'R') {
            const selectedEmail = document.querySelector('.email-item.selected') as HTMLElement;
            if (selectedEmail) {
                replyBox.style.display = 'block';
                replyBox.dataset.threadId = selectedEmail.dataset.id!;
            }
        }
    });

    fetchEmails();
});
