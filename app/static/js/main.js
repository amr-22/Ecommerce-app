document.addEventListener('DOMContentLoaded', function() {
    const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
    const cartButton = document.getElementById('cartButton');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.querySelector('.cart-count');
    const cartToast = document.getElementById('cartToast') ? new bootstrap.Toast(document.getElementById('cartToast')) : null;
    const toastMessage = document.getElementById('toastMessage');

    // Get CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content || '';

    // Show notification toast
    function showNotification(message) {
        if (cartToast && toastMessage) {
            toastMessage.textContent = message;
            cartToast.show();
        }
    }

    // Update cart count
    function updateCartCount() {
        fetch('/cart')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                const count = data.items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = count;
            })
            .catch(error => {
                console.error('Error updating cart count:', error);
            });
    }

    // Load cart items
    function loadCart() {
        fetch('/cart')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                cartItems.innerHTML = '';
                if (data.items.length === 0) {
                    cartItems.innerHTML = '<p class="text-center">Your cart is empty</p>';
                } else {
                    data.items.forEach(item => {
                        const itemElement = document.createElement('div');
                        itemElement.className = 'cart-item';
                        itemElement.innerHTML = `
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-0">${item.name}</h6>
                                    <small class="text-muted">$${item.price.toFixed(2)} each</small>
                                </div>
                                <div class="d-flex align-items-center">
                                    <input type="number" class="form-control quantity-control me-2" 
                                        value="${item.quantity}" min="1"
                                        data-cart-item-id="${item.id}">
                                    <button class="btn btn-danger btn-sm remove-item" 
                                        data-cart-item-id="${item.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        cartItems.appendChild(itemElement);
                    });
                }
                cartTotal.textContent = `$${data.total.toFixed(2)}`;

                // Add event listeners for quantity changes
                document.querySelectorAll('.quantity-control').forEach(input => {
                    input.addEventListener('change', function() {
                        updateQuantity(this.dataset.cartItemId, this.value);
                    });
                });

                // Add event listeners for remove buttons
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        removeItem(this.dataset.cartItemId);
                    });
                });
            })
            .catch(error => {
                console.error('Error loading cart:', error);
                cartItems.innerHTML = '<p class="text-center text-danger">Error loading cart</p>';
            });
    }

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            fetch('/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken
                },
                body: JSON.stringify({
                    product_id: productId,
                    quantity: 1
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.status === 'success') {
                    updateCartCount();
                    showNotification('Product added to cart');
                }
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                showNotification('Error adding to cart');
            });
        });
    });

    // Update quantity
    function updateQuantity(cartItemId, quantity) {
        fetch('/cart/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                cart_item_id: cartItemId,
                quantity: parseInt(quantity)
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                loadCart();
                updateCartCount();
                showNotification('Cart updated');
            }
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            showNotification('Error updating cart');
        });
    }

    // Remove item
    function removeItem(cartItemId) {
        fetch('/cart/remove', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({
                cart_item_id: cartItemId
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                loadCart();
                updateCartCount();
                showNotification('Item removed from cart');
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            showNotification('Error removing item');
        });
    }

    // Initialize cart
    if (cartButton) {
        updateCartCount();
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            loadCart();
            cartModal.show();
        });
    }
});
