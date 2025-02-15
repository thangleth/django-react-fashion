from django.db import models

# Create your models here.
class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    category_parent_id = models.IntegerField()
    category_name = models.CharField(max_length=225)
    is_hidden = models.BooleanField(default=False)

    class Meta:
        db_table = "category"

class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    product_name = models.CharField(max_length=255)
    price = models.IntegerField()
    price_promotion = models.IntegerField(default=0)
    category_id = models.ForeignKey(
        Category, 
        on_delete=models.CASCADE, 
        db_column='category_id'
    )
    is_hidden = models.BooleanField(default=False)

    class Meta:
        db_table = "product"

class ProductDetail(models.Model):
    product_detail_id = models.AutoField(primary_key=True)
    product_id = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        db_column='product_id',
        related_name='product_details'
    )
    color = models.CharField(max_length=100, null=True, blank=True)
    size = models.CharField(max_length=50, null=True, blank=True)
    image_url = models.CharField(max_length=255, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.IntegerField(default=0)
    is_primary = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=True)
    is_hot = models.BooleanField(default=False)

    class Meta:
        db_table = "product_detail"


class Review(models.Model):
    product_detail = models.ForeignKey(
        ProductDetail,
        on_delete=models.CASCADE,
        db_column='product_detail_id',
        related_name='reviews'
    )
    review_text = models.TextField()
    rating = models.IntegerField()

    class Meta:
        db_table = "review"