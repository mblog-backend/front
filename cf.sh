#!/bin/sh

VERSION=${git describe --tags --abbrev=0}
sed s/'REPLACE_VERSION_HERE'/'"$VERSION"'/g .env.production
yarn build-only