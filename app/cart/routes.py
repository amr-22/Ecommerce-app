from flask import jsonify, request
from flask_login import current_user, login_required
from app.models import CartItem, Product, db
from . import cart_bp

@cart_bp.route('/cart/add', methods=['POST'])
@login_required
def add_to_cart():
    data = request.get_json()
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    
    product = Product.query.get_or_404(product_id)
    cart_item = CartItem.query.filter_by(
        user_id=current_user.id,
        product_id=product_id
    ).first()
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            user_id=current_user.id,
            product_id=product_id,
            quantity=quantity
        )
        db.session.add(cart_item)
    
    try:
        db.session.commit()
        return jsonify({'message': 'Product added to cart', 'status': 'success'})
    except:
        db.session.rollback()
        return jsonify({'message': 'Error adding to cart', 'status': 'error'}), 500

@cart_bp.route('/cart/remove', methods=['POST'])
@login_required
def remove_from_cart():
    data = request.get_json()
    cart_item_id = data.get('cart_item_id')
    
    cart_item = CartItem.query.filter_by(
        id=cart_item_id,
        user_id=current_user.id
    ).first_or_404()
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({'message': 'Item removed from cart', 'status': 'success'})
    except:
        db.session.rollback()
        return jsonify({'message': 'Error removing item', 'status': 'error'}), 500

@cart_bp.route('/cart/update', methods=['POST'])
@login_required
def update_cart():
    data = request.get_json()
    cart_item_id = data.get('cart_item_id')
    quantity = data.get('quantity')
    
    if quantity < 1:
        return jsonify({'message': 'Invalid quantity', 'status': 'error'}), 400
    
    cart_item = CartItem.query.filter_by(
        id=cart_item_id,
        user_id=current_user.id
    ).first_or_404()
    
    try:
        cart_item.quantity = quantity
        db.session.commit()
        return jsonify({'message': 'Cart updated', 'status': 'success'})
    except:
        db.session.rollback()
        return jsonify({'message': 'Error updating cart', 'status': 'error'}), 500

@cart_bp.route('/cart')
@login_required
def view_cart():
    cart_items = CartItem.query.filter_by(user_id=current_user.id).all()
    total = sum(item.product.price * item.quantity for item in cart_items)
    return jsonify({
        'items': [{
            'id': item.id,
            'product_id': item.product_id,
            'name': item.product.name,
            'price': item.product.price,
            'quantity': item.quantity,
            'subtotal': item.product.price * item.quantity
        } for item in cart_items],
        'total': total
    })
