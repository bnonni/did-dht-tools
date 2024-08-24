echo "$SHELL detected"
RC_FILE="$([ "$SHELL" = "/bin/bash" ] && echo "$HOME/.bashrc" || [ "$SHELL" = "/bin/zsh" ] && echo "$HOME/.zshrc")"
echo "$RC_FILE identified"
INSTALLED="$(cat $RC_FILE | grep 'alias tool5' | wc -l | awk '{$1=$1;print}')"

if [[ "$INSTALLED" -gt 0 ]]; then
    echo "tool5 already installed"
    echo "run 'tool5 --help' to see help menu"
    exit 0
fi

if [[ "$SHELL" =~ ^(bash|zsh)$ ]]; then
    echo "Unsupported shell"
    exit 1
fi


echo "Installing tool5 to $RC_FILE"
echo $'\n'"alias tool5=\"node $PWD/dist/tool5.js\"" >> "$RC_FILE"
source "$RC_FILE"

echo "tool5 cli successfully installed"
echo "run 'tool5 --help' to see help menu"
