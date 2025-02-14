# Generated by Django 5.1.5 on 2025-02-14 02:14

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.CharField(max_length=128, primary_key=True, serialize=False, unique=True)),
                ('cognito_id', models.CharField(max_length=255, unique=True)),
                ('full_name', models.CharField(default='Unnamed User', help_text="User's full name (required)", max_length=150)),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(blank=True, help_text='Optional phone number in international format', max_length=16, null=True, validators=[django.core.validators.RegexValidator(message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.", regex='^\\+?1?\\d{9,15}$')])),
                ('avatar_url', models.URLField(blank=True, null=True)),
                ('currency', models.CharField(default='USD', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'users',
            },
        ),
    ]
