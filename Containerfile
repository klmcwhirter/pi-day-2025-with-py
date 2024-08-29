#*----------------------------------------------------------------------
#* pythonbuild
#*----------------------------------------------------------------------

FROM docker.io/library/python:3.12-alpine AS pythonbuild
ARG ENABLE_TESTS
ENV TZ=PST8PDT

WORKDIR /app

RUN apk upgrade && \
    mkdir -p /app/etc /app/src

COPY ./etc/gen_run_pytests.sh /app/etc/
COPY ./pi_py/ /app/pi_py/
COPY conftest.py pdm.lock pyproject.toml tox.ini /app/

RUN ENABLE_TESTS=$ENABLE_TESTS ./etc/gen_run_pytests.sh

#*----------------------------------------------------------------------
#* zigbuild
#*----------------------------------------------------------------------
FROM docker.io/library/fedora:40 AS zigbuild
ARG ENABLE_TESTS
# ARG ZIGVER=0.13.0
ARG ZIGVER=0.14.0-dev.1298+d9e8671d9
ENV TZ=PST8PDT
ENV ZIGARCH=zig-linux-x86_64-$ZIGVER.tar.xz
ENV ZIGBIN=zig-bin

WORKDIR /app

# TODO for now
COPY $ZIGARCH /app/

RUN ZIGVER=$ZIGVER ZIGARCH=$ZIGARCH ZIGBIN=$ZIGBIN \
    dnf update -y && \
    dnf -y install bash curl wabt && \
    touch ~/.bashrc && \
    curl https://wasmtime.dev/install.sh -sSf | bash - && \
    tar xf /app/$ZIGARCH && \
    # wget -O $ZIGARCH https://ziglang.org/download/$ZIGVER/$ZIGARCH && \
    # tar xf $ZIGARCH && \
    rm $ZIGARCH

COPY ./etc/build_run_zig_tests.sh /app/etc/
COPY pi_wasm/ /app/
    
RUN ENABLE_TESTS=$ENABLE_TESTS ZIGARCH=$ZIGARCH ZIGBIN=$ZIGBIN ./etc/build_run_zig_tests.sh

#*----------------------------------------------------------------------
#* build
#*----------------------------------------------------------------------

FROM docker.io/library/node:20-alpine AS build
ENV TZ=PST8PDT

RUN apk upgrade

WORKDIR /app

COPY pi_ui/package.json /app/package.json

RUN rm -fr node_modules && npm install

COPY pi_ui/public/ /app/public/
COPY pi_ui/src/ /app/src/
COPY pi_ui/*.js pi_ui/*.html pi_ui/*.json pi_ui/*.ts /app/

RUN npm run build

COPY --from=zigbuild /app/zig-build.* /app/dist/
COPY --from=zigbuild /app/zig-tests.* /app/dist/

# used for integration testing pi-digits.wasm: execute `node pi-digits.cjs` in the container
COPY --from=zigbuild /app/zig-out/bin/pi-digits.cjs /app/dist/
COPY --from=zigbuild /app/zig-out/bin/pi-digits.wasm /app/dist/
COPY --from=zigbuild /app/zig-out/bin/pi-digits.wat /app/dist/

COPY --from=pythonbuild /app/python-tests.* /app/dist/

EXPOSE 9000
CMD ["npm", "start"]


#*----------------------------------------------------------------------
#* final
#*----------------------------------------------------------------------

# FROM nginx:mainline-alpine
# ENV TZ=PST8PDT

# RUN apk upgrade --no-cache

# WORKDIR /usr/share/nginx/html

# COPY --from=build /app/dist/ /usr/share/nginx/html

# EXPOSE 80
