# Build electron App
cd javascript_ui
yarn install
yarn build
# Make built electron app executable
# chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor"
chmod +x "dist/electron/Packaged/Ethos Heat Monitor-linux-armv64/Ethos Heat Monitor"
cd ..