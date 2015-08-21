#!/bin/bash

BUILD=public
ROOT=/var/www/commonform.org
FLAGS="--verbose --checksum --recursive --sparse --compress --human-readable --progress"
REF=${1:=HEAD}

(
	set -e
	COMMIT=`git rev-parse "$REF"`
	BASE="s/<head>/<head><base href='https:\/\/commonform.org\/releases\/$COMMIT\/'>/"
	GITDIR=`pwd`
	TMPDIR=`mktemp -d`
	trap "{ cd "$GITDIR" ; rm -rf "$TMPDIR"; exit 255; }" SIGINT EXIT
	git clone -s "$GITDIR" "$TMPDIR"
	cd $TMPDIR
	npm install
	npm run build
	rsync $FLAGS $BUILD/* commonform.org:$ROOT/releases/$COMMIT
	cat $BUILD/index.html | sed -e "$BASE" > index.html
	rsync $FLAGS index.html commonform.org:$ROOT/
)
