from flask import render_template, request, current_app
from app.models import Product
from . import main_bp
from sqlalchemy.exc import SQLAlchemyError

@main_bp.route('/')
def index():
    try:
        page = request.args.get('page', 1, type=int)
        category = request.args.get('category', None)
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        sort_by = request.args.get('sort_by', 'popularity')
        
        # Base query
        query = Product.query
        
        # Apply filters
        if category:
            query = query.filter_by(category=category)
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        # Apply sorting
        if sort_by == 'price_low':
            query = query.order_by(Product.price.asc())
        elif sort_by == 'price_high':
            query = query.order_by(Product.price.desc())
        else:  # default to popularity
            query = query.order_by(Product.popularity.desc())
        
        # Paginate results
        products = query.paginate(page=page, per_page=12, error_out=False)
        
        # Get unique categories for filter
        categories = Product.query.with_entities(Product.category).distinct().all()
        categories = [c[0] for c in categories]
        
        return render_template('main/index.html',
                            products=products,
                            categories=categories,
                            current_category=category,
                            current_min_price=min_price,
                            current_max_price=max_price,
                            current_sort=sort_by)
    except SQLAlchemyError as e:
        current_app.logger.error(f"Database error: {str(e)}")
        # Return empty data with error flag
        return render_template('main/index.html',
                            products=None,
                            categories=[],
                            error=True)
