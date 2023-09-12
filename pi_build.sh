# Run nvm setup
# This lets us run yarn in cron job
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Build electron App
cd javascript_ui
yarn install
yarn build
# Make built electron app executable
# chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor"
chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-arm64/Ethos Heat Monitor"
cd ..