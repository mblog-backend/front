#!/bin/sh

git fetch -t 
VERSION=$(git describe --tags --abbrev=0)
sed -i 's#REPLACE_VERSION_HERE#'"$VERSION"'#g' .env.production
yarn build-only