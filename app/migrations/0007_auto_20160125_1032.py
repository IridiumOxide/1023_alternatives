# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-25 09:32
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_press_correct'),
    ]

    operations = [
        migrations.AlterField(
            model_name='session',
            name='end_date',
            field=models.DateTimeField(max_length=255),
        ),
        migrations.AlterField(
            model_name='session',
            name='start_date',
            field=models.CharField(max_length=255),
        ),
    ]
