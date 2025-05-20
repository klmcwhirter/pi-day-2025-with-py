#!/usr/bin/env bash

source .devcontainer/vsc-utils.sh

echo $0: $(pwd)

echo_eval cd pi_ui

if ! grep -E '^VITE_SOLIDJS_VER=' .env
then
    echo 'VITE_SOLIDJS_VER='$(cat package.json | jq -cr '.dependencies["solid-js"]') | tee -a .env
fi

echo_eval pnpm install
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

echo_eval mkdir -p ./src/pi-wasm

echo_eval cp ../pi_wasm/build/{pi-wasm-tester.mjs,pi-digits.d.ts,pi-digits.js,pi-digits.wasm,pi-digits.wasm.map,pi-digits.wat,utils.mjs} ./src/pi-wasm/
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

echo_eval pnpm run build
rc=$?
echo rc=${rc}
[ $rc -ne 0 ] && exit $rc

exit 0
