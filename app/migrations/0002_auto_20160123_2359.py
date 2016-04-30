# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-01-23 22:59
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=80)),
                ('gender', models.CharField(choices=[('M', 'MALE'), ('F', 'FEMALE'), ('B', 'BOTH'), ('N', 'NONE'), ('O', 'OTHER'), ('-', 'NOT DISCLOSED')], default='-', max_length=1)),
                ('age', models.IntegerField()),
            ],
        ),
        migrations.RenameModel(
            old_name='ExpeimentDefinition',
            new_name='ExperimentDefinition',
        ),
        migrations.RemoveField(
            model_name='experimentinstance',
            name='username',
        ),
        migrations.AddField(
            model_name='experimentinstance',
            name='user',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='app.User'),
            preserve_default=False,
        ),
    ]
