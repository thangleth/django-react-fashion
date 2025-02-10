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
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    is_hidden = models.BooleanField(default=False)

    class Meta:
        db_table = "product"