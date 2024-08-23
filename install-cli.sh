#!/usr/bin/env

set -e

if [ "$SHELL" == "/bin/bash" ]; then
    echo "Bash detected. Installing web5-tools cli."
    echo $'\n''alias web5-tools="node /Users/bnonni/Projects/Personal/web5-tools/dist/web5-tools.js"' >> ~/.bashrc
    source ~/.bashrc
elif [ "$SHELL" == "/bin/zsh" ]; then
    echo "Zsh detected. Installing web5-tools cli."
    echo $'\n''alias web5-tools="node /Users/bnonni/Projects/Personal/web5-tools/dist/web5-tools.js"' >> ~/.zshrc
    source ~/.zshrc
else
    echo "Unsupported shell!"
    exit 1
fi

echo "web5-tools cli successfully installed, run 'web5-tools' to start using it."
