# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-24 19:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_experimentinstance_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experimentinstance',
            name='name',
            field=models.CharField(max_length=255, unique=True),
        ),
    ]