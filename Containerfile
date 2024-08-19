#*----------------------------------------------------------------------
#* pythonbuild
#*----------------------------------------------------------------------

FROM docker.io/library/python:3.12-alpine AS pythonbuild
ARG ENABLE_TESTS

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
        true
    # wasm-dis zig-out/bin/pi-digits.wasm -o zig-out/bin/pi-digits.wat

# #*----------------------------------------------------------------------
# #* build
# #*----------------------------------------------------------------------

# FROM docker.io/library/node:20-alpine AS build

# RUN apk upgrade

# # ENV TZ=PST8PDT set in docker-compose.yml

# WORKDIR /app
# COPY . /app
# COPY --from=zigbuild /app/zig-build.* .
# COPY --from=zigbuild /app/zig-tests.* .
# # used for integration testing pi-digits.wasm: execute `node public/pi-digits.cjs` in the container
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.cjs ./public/pi-digits.cjs
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.wasm ./public/pi-digits.wasm
# COPY --from=zigbuild /app/zig-out/bin/pi-digits.wat ./public/pi-digits.wat

# COPY --from=pythonbuild /app/piadapter.tgz ./public/piadapter.tgz
# COPY --from=pythonbuild /app/python-tests.* .

# RUN npm install && \
#     etc/clean_final.sh && \
#     rm -fr etc/

# ## Until I can work through the pyodide build issues ...
# EXPOSE 3000
# CMD ["npm", "start"]


# # RUN npm install && npm run build


# #*----------------------------------------------------------------------
# #* final
# #*----------------------------------------------------------------------

# # FROM nginx:mainline-alpine
# # RUN apk upgrade --no-cache

# # COPY --from=build /app/dist /usr/share/nginx/html
