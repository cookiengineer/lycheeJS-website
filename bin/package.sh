#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
LYCHEEJS_VERSION=$(cd $LYCHEEJS_ROOT && cat ./libraries/lychee/source/core/lychee.js | grep VERSION | cut -d\" -f2);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);


if [ -d $PROJECT_ROOT/build ]; then

	cd $PROJECT_ROOT/build;
	echo "lychee.js.org" > $PROJECT_ROOT/build/CNAME;

	rm -rf ./.git;
	git init;
	git remote add origin git@github.com:Artificial-Engineering/lycheejs-website.git;

	git checkout -b gh-pages;
	git add ./;
	git commit -m ":construction: lychee.js Website $LYCHEEJS_VERSION CI build :construction:";

	cd $PROJECT_ROOT;
	git checkout master;
	sed -i 's|2[0-9][0-9][0-9]-Q[1-4]|'$LYCHEEJS_VERSION'|g' ./README.md;
	git add ./README.md;
	git commit -m ":construction: lychee.js Website $LYCHEEJS_VERSION CI build :construction:";

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;
