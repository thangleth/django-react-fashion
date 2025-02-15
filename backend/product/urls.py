from django.urls import path
from .views import *

urlpatterns = [
    path('product/', get_product_list, name='product-list'),
    path('product/feature/', get_feature_product, name='featured-products'),
    path('category/',get_category_list, name='category-list'),
]