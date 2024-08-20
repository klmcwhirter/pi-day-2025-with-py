#*----------------------------------------------------------------------
#* pythonbuild
#*----------------------------------------------------------------------

FROM docker.io/library/python:3.12-alpine AS pythonbuild
ARG ENABLE_TESTS
ENV TZ=PST8PDT

WORKDIR /app

RUN mkdir -p /app/etc /app/src
COPY ./etc/gen_run_pytests.sh ./etc/pi1000000.txt /app/etc/
COPY ./pi_py/ /app/pi_py/
COPY conftest.py pdm.lock pyproject.toml tox.ini /app/

RUN apk upgrade && \
    ENABLE_TESTS=$ENABLE_TESTS PI_1M_FILE=$PI_1M_FILE PI_GOSPER_FILE=$PI_GOSPER_FILE PI_SAHA_SINHA_FILE=$PI_SAHA_SINHA_FILE \
        ./etc/gen_run_pytests.sh

#*----------------------------------------------------------------------
#* zigbuild
#*----------------------------------------------------------------------
FROM docker.io/library/alpine AS zigbuild
ARG ENABLE_TESTS
ARG ZIGVER=0.13.0
ENV TZ=PST8PDT

WORKDIR /app
COPY ./etc/build_run_zig_tests.sh /app/etc/
COPY pi_wasm/ /app/

RUN ZIGVER=$ZIGVER && ZIGARCH=zig-linux-x86_64-$ZIGVER.tar.xz && ZIGBIN=zig-bin && \
    apk upgrade && \
    apk add binaryen && \
    wget -O $ZIGARCH https://ziglang.org/download/$ZIGVER/$ZIGARCH && \
    tar xf $ZIGARCH && \
    rm $ZIGARCH && \
    ENABLE_TESTS=$ENABLE_TESTS ZIGARCH=$ZIGARCH ZIGBIN=$ZIGBIN ./etc/build_run_zig_tests.sh && \
    wasm-dis zig-out/bin/pi-digits.wasm -o zig-out/bin/pi-digits.wat

# #*----------------------------------------------------------------------
# #* build
# #*----------------------------------------------------------------------

FROM docker.io/library/node:20-alpine AS build
ENV TZ=PST8PDT

RUN apk upgrade


WORKDIR /app
COPY pi_ui/ /app/

COPY --from=zigbuild /app/zig-build.* .
COPY --from=zigbuild /app/zig-tests.* .

# used for integration testing pi-digits.wasm: execute `node pi-digits.cjs` in the container
COPY --from=zigbuild /app/zig-out/bin/pi-digits.cjs ./pi-digits.cjs
COPY --from=zigbuild /app/zig-out/bin/pi-digits.wasm ./pi-digits.wasm
COPY --from=zigbuild /app/zig-out/bin/pi-digits.wat ./pi-digits.wat

COPY --from=pythonbuild /app/python-tests.* .

RUN npm install  # && npm run build

EXPOSE 3000
CMD ["npm", "start"]


#*----------------------------------------------------------------------
#* final
#*----------------------------------------------------------------------

# FROM nginx:mainline-alpine
# ENV TZ=PST8PDT

# RUN apk upgrade --no-cache

# WORKDIR /usr/share/nginx/html

# COPY --from=build /app/dist/ /usr/share/nginx/html

# COPY --from=zigbuild /app/zig-build.* .
# COPY --from=zigbuild /app/zig-tests.* .

# # used for integration testing pi-digits.wasm: execute `node pi-digits.cjs` in the container
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.cjs ./pi-digits.cjs
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.wasm ./pi-digits.wasm
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.wat ./pi-digits.wat

# COPY --from=pythonbuild /app/python-tests.* .

# EXPOSE 80
