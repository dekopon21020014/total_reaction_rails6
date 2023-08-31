# docker compose run app bash -c "gem install rails -v 6.1.7 && rails new . -d mysql"
# Railsのconfig/database.ymlのpasswordとhostを編集する
# 2回目からはdocker compose upでオッケー

# Rubyは使っているバージョンに合わせる
FROM ruby:3.1.2
# Rails6用(Rails7では不要)
RUN apt-get update && apt-get install -y nodejs npm gcc && npm i -g yarn 
#RUN git clone https://github.com/ImageMagick/ImageMagick.git ImageMagick-7.1.0-5 && \
RUN git clone -b 7.1.1-5 --depth 1 https://github.com/ImageMagick/ImageMagick.git ImageMagick-7.1.1-5 && \
    /ImageMagick-7.1.1-5/configure && \
    /usr/bin/make && \
    /usr/bin/make install && \
    echo "/usr/local/lib" > /etc/ld.so.conf.d/usr-local-lib.conf && \
    ldconfig -v

RUN npm install n -g && n 16.17.1 && hash -r 
WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle
COPY . .

ENTRYPOINT ["bash", "/app/entrypoint.sh"]

CMD ["rails", "s", "-b", "0.0.0.0"]