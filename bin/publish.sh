#!/bin/bash

LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);


if [ -d $PROJECT_ROOT/build ]; then

	# XXX: gh-pages branch

	cd $PROJECT_ROOT/build;
	git checkout gh-pages;
	git push origin gh-pages -f;

	# XXX: master branch

	cd $PROJECT_ROOT;
	git checkout master;
	git push origin master;

	if [ $? == 0 ]; then
		echo "SUCCESS";
		exit 0;
	else
		echo "FAILURE";
		exit 1;
	fi;

else

	echo "FAILURE";
	exit 1;

fi;

