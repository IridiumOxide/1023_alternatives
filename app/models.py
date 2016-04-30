from __future__ import unicode_literals

from django.db import models

# Create your models here.


class ExperimentDefinition(models.Model):
    feedback = models.BooleanField()
    wait_for_answers = models.BooleanField()
    time = models.IntegerField()
    training_length = models.IntegerField()
    session_count = models.IntegerField()
    session_length = models.IntegerField()  # max 1023
    name = models.CharField(max_length=255)
    message1 = models.CharField(max_length=1023, default="Witaj w eksperymencie!")
    message2 = models.CharField(max_length=1023, default="Koniec treningu!")
    message3 = models.CharField(max_length=1023, default="Koniec sesji!")
    message4 = models.CharField(max_length=1023, default="Koniec eksperymentu, dziekujemy!")

    def __str__(self):
        return self.name


class User(models.Model):
    username = models.CharField(max_length=80)
    gender = models.CharField(max_length=1, choices=(('M', 'MALE'), ('F', 'FEMALE'), ('B', 'BOTH'), ('N', 'NONE'), ('O', 'OTHER'), ('-', 'NOT DISCLOSED'), ('U', 'UNSET')), default='U')
    age = models.IntegerField(default=-1)

    def __str__(self):
        return self.username


class ExperimentInstance(models.Model):
    name = models.CharField(max_length=255, unique=True)
    user = models.ForeignKey('User')
    definition = models.ForeignKey('ExperimentDefinition')

    def __str__(self):
        return self.name + ":  " + self.user.__str__() + " - " + self.definition.__str__()


class Session(models.Model):
    instance = models.ForeignKey('ExperimentInstance')
    start_date = models.CharField(max_length=255)
    end_date = models.DateTimeField(max_length=255)


class Test(models.Model):
    session = models.ForeignKey('Session')
    number = models.IntegerField()  # 0-1023


class Press(models.Model):
    test = models.ForeignKey('Test')
    key_number = models.IntegerField()
    time = models.FloatField()
    correct = models.BooleanField()
