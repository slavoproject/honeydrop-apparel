// Page Navigation
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        window.scrollTo(0, 0);
    }
}

// FAQ Toggle
function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const isOpen = answer.classList.contains('open');
    
    // Close all FAQs
    document.querySelectorAll('.faq-answer').forEach(item => {
        item.classList.remove('open');
    });
    
    // Open clicked FAQ if it was closed
    if (!isOpen) {
        answer.classList.add('open');
    }
}

// Size Button Selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// Quantity Controls
const qtyDisplay = document.querySelector('.qty-display');
const qtyBtns = document.querySelectorAll('.qty-btn');

qtyBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        let currentQty = parseInt(qtyDisplay.textContent);
        if (this.textContent === '+') {
            currentQty++;
        } else if (this.textContent === '-' && currentQty > 1) {
            currentQty--;
        }
        qtyDisplay.textContent = currentQty;
    });
});

// Add to Cart Animation
document.querySelectorAll('.btn-primary').forEach(btn => {
    if (btn.textContent.includes('Add to Cart')) {
        btn.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = '✓ Added!';
            this.style.background = '#4CAF50';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.background = '';
            }, 2000);
        });
    }
});

// Wishlist Toggle
document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.textContent = this.textContent === '♡' ? '♥' : '♡';
        this.style.color = this.textContent === '♥' ? 'var(--honey-gold)' : '';
    });
});
