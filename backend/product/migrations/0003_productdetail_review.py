# Generated by Django 5.1.6 on 2025-02-13 18:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0002_alter_product_category_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductDetail',
            fields=[
                ('product_detail_id', models.AutoField(primary_key=True, serialize=False)),
                ('color', models.CharField(blank=True, max_length=100, null=True)),
                ('size', models.CharField(blank=True, max_length=50, null=True)),
                ('image_url', models.CharField(blank=True, max_length=255, null=True)),
                ('description', models.CharField(blank=True, max_length=255, null=True)),
                ('quantity', models.IntegerField(default=0)),
                ('is_primary', models.BooleanField(default=True)),
                ('is_featured', models.BooleanField(default=False)),
                ('is_hot', models.BooleanField(default=False)),
                ('product', models.ForeignKey(db_column='product_id', on_delete=django.db.models.deletion.CASCADE, related_name='product_details', to='product.product')),
            ],
            options={
                'db_table': 'product_detail',
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_text', models.TextField()),
                ('rating', models.IntegerField()),
                ('product_detail', models.ForeignKey(db_column='product_detail_id', on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='product.productdetail')),
            ],
            options={
                'db_table': 'review',
            },
        ),
    ]
