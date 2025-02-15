# products/serializers.py
from rest_framework import serializers
from .models import *

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetail
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    details = ProductDetailSerializer(many=True, read_only=True, source='productdetail_set')
    
    class Meta:
        model = Product
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

