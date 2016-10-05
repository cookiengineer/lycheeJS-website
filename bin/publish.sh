#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);


if [ -d $PROJECT_ROOT/build ]; then

	cd $PROJECT_ROOT/build;
	git checkout gh-pages;
	git push origin gh-pages -f;

	cd $PROJECT_ROOT;
	git checkout master;
	git push origin master -f;

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

