#!/usr/bin/env sh

set -e

DIST="$PWD/dist/esm"
TOOL5_JS="$DIST/bin/tool5.js"
TOOL5_EXEC="$DIST/tool5"
NODE_MODULES="$PWD/node_modules"
SHELL_FILE=""
FORCE=false
NODE_HOME=`command -v node`

alias tool5="$NODE_HOME $TOOL5_EXEC"

while [ $# -gt 0 ]; do
    case "$1" in
        -f|--force)
            FORCE=true
            ;;
    esac
    shift
done

clone_repo () {
    # Check if the current directory is a git repo
    if [ -d ".git" ]; then
        # Check if the remote origin is the correct repo
        repo_url=$(git config --get remote.origin.url)
        if echo "$repo_url" | grep -qE '^https:\/\/github\.com\/[^\/]+\/tool5(\.git)?$|^git@github\.com:[^\/]+\/tool5(\.git)?$'; then
            echo "Already in the tool5 repo, skipping clone."
        else
            echo "The current directory is a git repo, but not tool5. Exiting."
            exit 1
        fi
    else
        # If not a git repo, clone the tool5 repo
        git clone git@github.com:bnonni/tool5.git
        cd tool5
    fi
}

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
        mv $TOOL5_JS $TOOL5_EXEC
    else
        echo "Build detected, skipping build ..."
    fi
}

check_shell () {
    case "$SHELL" in
        */bash) SHELL_FILE="$HOME/.bash_profile";;
        */zsh) SHELL_FILE="$HOME/.zshenv";;
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
    IS_INSTALLED_CHECK="$(cat $SHELL_FILE | grep 'alias tool5' | wc -l | awk '{$1=$1;print}')"
    if [[ -f "$TOOL5_EXEC" && "$IS_INSTALLED_CHECK" -gt 0 ]]; then
        echo "ERROR: Install failed, tool5 already installed!"
        tool5 -h
        exit 0
    fi
}

install_tool5 () {
    check_install
    echo "Installing tool5 ..."
    mv $TOOL5_JS $TOOL5_EXEC
    chmod u+x "$TOOL5_EXEC"
    cp "$SHELL_FILE" "$SHELL_FILE.bak"
    echo $'\n'"alias tool5=\"$NODE_HOME $TOOL5_EXEC\"" >> "$SHELL_FILE"
    source "$SHELL_FILE"
    echo "Installed tool5 successfully!"
    tool5 -h
}

clone_repo
check_dependencies
check_build
check_shell
install_tool5
