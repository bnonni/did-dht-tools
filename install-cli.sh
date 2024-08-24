#!/usr/bin/env

set -e

if [ "$SHELL" == "/bin/bash" ]; then
    echo "Bash detected. Installing tool5 cli."
    echo $'\n'"alias tool5="node $PWD/dist/web5-tools.js" >> ~/.bashrc
    source ~/.bashrc
elif [ "$SHELL" == "/bin/zsh" ]; then
    echo "Zsh detected. Installing tool5 cli."
    echo $'\n'"alias tool5="node $PWD/dist/web5-tools.js" >> ~/.zshrc
    source ~/.zshrc
else
    echo "Unsupported shell!"
    exit 1
fi

echo "tool5 cli successfully installed, run 'tool5 --help' to start using it."
