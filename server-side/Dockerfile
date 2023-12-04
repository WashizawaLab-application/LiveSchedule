FROM python:3.8.10

ENV PYTHONUNBUFFERD 1

RUN mkdir /workspace
COPY requirements.txt /workspace
WORKDIR /workspace

RUN pip install --upgrade pip\
    && pip install --upgrade setuptools\
    && pip install -r requirements.txt

CMD python manage.py runserver 0.0.0.0:8000