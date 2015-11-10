FROM ubuntu:14.04
WORKDIR /code
ADD requirements.txt /code/

RUN apt-get update && apt-get install -y libspatialite5 libspatialite-dev spatialite-bin \
gdal-bin libproj-dev libgeos++-dev libgeos-dev python-dev build-essential git unzip python-numpy python-pip

RUN CFLAGS=-I/usr/include pip install --pre pyspatialite
RUN pip install -r requirements.txt
RUN echo '/usr/local/lib' >> /etc/ld.so.conf
RUN ldconfig
ADD . /code
EXPOSE 8000
CMD python app.py