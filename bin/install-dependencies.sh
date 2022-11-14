#!/usr/bin/env sh

set -e

installDependency() {
    if [ "`basename "$(realpath ..)"`" = "node_modules" ]; then
        node_modules=".."
    else 
        node_modules="node_modules"
    fi

    (mkdir -p "$node_modules/$1" && cd "$node_modules/$1" && wget -O - "$2" | tar -xz --strip-components=1)
}

installDependency flux-express-server-api https://github.com/fluxfw/flux-express-server-api/archive/refs/tags/v2022-10-28-1.tar.gz

installDependency flux-fetch-api https://github.com/fluxfw/flux-fetch-api/archive/refs/tags/v2022-11-03-1.tar.gz

installDependency flux-json-api https://github.com/fluxfw/flux-json-api/archive/refs/tags/v2022-11-01-1.tar.gz

installDependency flux-shutdown-handler-api https://github.com/fluxfw/flux-shutdown-handler-api/archive/refs/tags/v2022-10-28-1.tar.gz

installDependency flux-studies-selfservice-frontend/src https://github.com/fluxfw/flux-studies-selfservice-frontend/releases/download/v2022-11-14-2/flux-studies-selfservice-frontend-v2022-11-14-2-build.tar.gz
