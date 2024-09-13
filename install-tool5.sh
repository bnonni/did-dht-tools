#!/usr/bin/env sh

set -e

DIST="$PWD/dist"
TOOL5="$DIST/tool5"
TOOL5_JS="$DIST/tool5.js"
NODE_MODULES="$PWD/node_modules/"
SHELL_FILE=""
FORCE=false

while [ $# -gt 0 ]; do
    case "$1" in
        -f|--force)
            FORCE=true
            ;;
    esac
    shift
done

check_dependencies () {
    echo "Checking dependencies ..."
    if [ ! -d "$NODE_MODULES" ]; then
        echo "Dependencies not installed, installing ..."
        npm install
    else
        echo "Dependencies installed, skipping install and build ..."
    fi
}

check_build () {
    echo "Checking build ..."
    if [ ! -f "$TOOL5_JS" ]; then
        echo "No build detected, building ..."
        npm run build
    else
        echo "Build detected, skipping build ..."
    fi
}

check_shell () {
    case "$SHELL" in
        */bash) SHELL_FILE="$HOME/.bashrc";;
        */zsh) SHELL_FILE="$HOME/.zshrc";;
        */sh) SHELL_FILE="$HOME/.profile";;
        */ksh) SHELL_FILE="$HOME/.kshrc";;
        */fish) SHELL_FILE="$HOME/.config/fish/config.fish";;
        *) SHELL_FILE="$HOME/.profile";;
    esac
    if [ -z $SHELL_FILE ]; then
        echo "ERROR: unknown shell, exiting ..."
        exit 1
    fi
    echo "Shell detected: $SHELL"
    echo "Shell file detected: $SHELL_FILE"
}

check_install () {
    echo "Checking for tool5 install ..."
    IS_INSTALLED_CHECK_2="$(cat $SHELL_FILE | grep 'alias tool5' | wc -l | awk '{$1=$1;print}')"
    if [[ -f "$TOOL5" || "$IS_INSTALLED_CHECK_2" -gt 0 ]]; then
        echo "ERROR: Install failed, tool5 already installed!"
        tool5 -h
        exit 0
    fi
}

install_tool5 () {
    check_install
    echo "Installing tool5 ..."
    mv "$TOOL5_JS" "$TOOL5"
    chmod u+x "$TOOL5"
    echo $'\n'"alias tool5=\"`which node` $TOOL5\"" >> "$SHELL_FILE"
    source "$SHELL_FILE"
    echo "Installed tool5 successfully!"
    `which tool5` --help
}

check_dependencies
check_build
check_shell
install_tool5
