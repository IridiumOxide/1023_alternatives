from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from models import User, ExperimentDefinition, ExperimentInstance, Session, Test, Press
import csv

# Create your views here.


def index(request):
    users = User.objects.all()
    context = {'users': users}
    return render(request, 'app/namechoose.html', context)


def get_data(request):
    users = User.objects.all()
    context = {'users': users}
    return render(request, 'app/get_data.html', context)


def show_data(request, username):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="' + username + '.csv"'
    writer = csv.writer(response)
    user = User.objects.get(username=username)
    writer.writerow(['Experiment name', 'Experiment type', 'Session start', 'Session end',
                     'Tested combination', 'Key Press', 'Press time', user.username, user.age, user.gender])
    experiments = ExperimentInstance.objects.filter(user=user)
    for experiment in experiments:
        sessions = Session.objects.filter(instance=experiment)
        for session in sessions:
            tests = Test.objects.filter(session=session)
            for test in tests:
                presses = Press.objects.filter(test=test)
                for press in presses:
                    writer.writerow([experiment.name, experiment.definition.name, session.start_date,
                                     session.end_date, test.number, press.key_number, press.time])
    return response


def user_site(request, username):
    owner = get_object_or_404(User, username=username)
    data_unset = False
    if owner.gender == "U":
        data_unset = True
    experiments = ExperimentInstance.objects.filter(user=owner)
    completed = []
    in_progress = []
    new = []
    for experiment in experiments:
        sessions = Session.objects.filter(instance=experiment)
        if len(sessions) == 0:
            new.append(experiment)
        else:
            full = True
            definition = experiment.definition
            should_be_sessions = definition.session_count
            tests_in_session = definition.session_length

            if len(sessions) != should_be_sessions:
                full = False
            if full:
                for session in sessions:
                    tests = Test.objects.filter(session=session)
                    test_n = len(tests)
                    if test_n != tests_in_session:
                        full = False
            if full:
                completed.append(experiment)
            else:
                in_progress.append(experiment)

    context = {'username': username,
               'data_unset': data_unset,
               'completed': completed,
               'in_progress': in_progress,
               'new': new}
    return render(request, 'app/user_site.html', context)


def experiment_view(request, instance_name):
    instance = get_object_or_404(ExperimentInstance, name=instance_name)
    context = {'definition': instance.definition,
               'instance_name': instance_name}
    return render(request, 'app/experiment_view.html', context)


def get_definition(request, defname):
    definition = get_object_or_404(ExperimentDefinition, name=defname)
    return JsonResponse({
        'feedback': definition.feedback,
        'wait_for_answers': definition.wait_for_answers,
        'time': definition.time,
        'training_length': definition.training_length,
        'session_count': definition.session_count,
        'session_length': definition.session_length,
        'name': definition.name,
        'message1': definition.message1,
        'message2': definition.message2,
        'message3': definition.message3,
        'message4': definition.message4,
    })


def get_session_info(request, instance_name):
    instance = get_object_or_404(ExperimentInstance, name=instance_name)
    sessions = Session.objects.filter(instance=instance)
    should_be_tests = instance.definition.session_length
    for session in sessions:
        tests = Test.objects.filter(session=session)
        if len(tests) != should_be_tests:
            return JsonResponse({
                'starti': len(tests),
                'session_start': session.start_date})
    return JsonResponse({'starti': 0})


def update_session(request, instance_name):
    start_date = request.POST['start_date']
    instance = get_object_or_404(ExperimentInstance, name=instance_name)
    session = get_object_or_404(Session, instance=instance, start_date=start_date)
    session.end_date = request.POST['end_date']
    print session.start_date
    print session.end_date
    session.save()
    return JsonResponse({'ok': 'ok'})


def add_session(request, instance_name):
    start_date = request.POST['start_date']
    end_date = request.POST['end_date']
    instance = get_object_or_404(ExperimentInstance, name=instance_name)
    session = Session(instance=instance, start_date=start_date, end_date=end_date)
    session.save()
    return JsonResponse({'ok': 'ok'})


def send_presses(request, instance_name):
    instance = get_object_or_404(ExperimentInstance, name=instance_name)
    sessions = Session.objects.filter(instance=instance)
    searched_session = 0
    _dict = request.POST.copy()
    for session in sessions:
        tests = Test.objects.filter(session=session)
        if len(tests) < instance.definition.session_length:
            searched_session = session
    new_test = Test(session=searched_session, number=_dict['config'])
    new_test.save()
    del(_dict['config'])
    print _dict
    for i in _dict:
        new_press = Press(test=new_test, key_number=int(i), time=int(_dict[i]), correct=True)
        new_press.save()
    return JsonResponse({'ok': 'ok'})


def setpersonal(request, username):
    user = get_object_or_404(User, username=username)
    age = request.POST['age']
    gender = request.POST['gender']
    user.age = int(age)
    user.gender = gender
    user.save()
    return JsonResponse({'ok': 'ok'})
