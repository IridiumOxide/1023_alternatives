# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-02-02 20:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20160125_1032'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='gender',
            field=models.CharField(choices=[('M', 'MALE'), ('F', 'FEMALE'), ('B', 'BOTH'), ('N', 'NONE'), ('O', 'OTHER'), ('-', 'NOT DISCLOSED'), ('U', 'UNSET')], default='U', max_length=1),
        ),
    ]
