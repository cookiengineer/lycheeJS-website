#!/bin/bash

if [ -z "$LYCHEEJS_ROOT" ]; then
	LYCHEEJS_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../../../"; pwd);
fi;


PROJECT_ROOT=$(cd "$(dirname "$(readlink -f "$0")")/../"; pwd);
LYCHEEJS_FERTILIZER="$LYCHEEJS_ROOT/libraries/fertilizer/bin/fertilizer.sh";
LYCHEEJS_HELPER="$LYCHEEJS_ROOT/bin/helper.sh";


if [ -e "$LYCHEEJS_FERTILIZER" ]; then

	cd $PROJECT_ROOT;

	rm -rf "$PROJECT_ROOT/release";
	mkdir -p "$PROJECT_ROOT/release";

	rm -rf "$PROJECT_ROOT/build";
	mkdir -p "$PROJECT_ROOT/build";


	# XXX: Offline Examples

	$LYCHEEJS_FERTILIZER auto /projects/boilerplate;
	mv "$LYCHEEJS_ROOT/projects/boilerplate/build/boilerplate_browser_all.zip"    "$PROJECT_ROOT/release/boilerplate_browser_all.zip";
	mv "$LYCHEEJS_ROOT/projects/boilerplate/build/boilerplate_linux_x86_64.zip"   "$PROJECT_ROOT/release/boilerplate_linux_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/boilerplate/build/boilerplate_osx_x86_64.zip"     "$PROJECT_ROOT/release/boilerplate_osx_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/boilerplate/build/boilerplate_windows_x86_64.zip" "$PROJECT_ROOT/release/boilerplate_windows_x86_64.zip";

	$LYCHEEJS_FERTILIZER auto /projects/lethalmaze;
	mv "$LYCHEEJS_ROOT/projects/lethalmaze/build/lethalmaze_browser_all.zip"    "$PROJECT_ROOT/release/lethalmaze_browser_all.zip";
	mv "$LYCHEEJS_ROOT/projects/lethalmaze/build/lethalmaze_linux_x86_64.zip"   "$PROJECT_ROOT/release/lethalmaze_linux_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/lethalmaze/build/lethalmaze_osx_x86_64.zip"     "$PROJECT_ROOT/release/lethalmaze_osx_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/lethalmaze/build/lethalmaze_windows_x86_64.zip" "$PROJECT_ROOT/release/lethalmaze_windows_x86_64.zip";

	$LYCHEEJS_FERTILIZER auto /projects/mode7;
	mv "$LYCHEEJS_ROOT/projects/mode7/build/mode7_browser_all.zip"    "$PROJECT_ROOT/release/mode7_browser_all.zip";
	mv "$LYCHEEJS_ROOT/projects/mode7/build/mode7_linux_x86_64.zip"   "$PROJECT_ROOT/release/mode7_linux_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/mode7/build/mode7_osx_x86_64.zip"     "$PROJECT_ROOT/release/mode7_osx_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/mode7/build/mode7_windows_x86_64.zip" "$PROJECT_ROOT/release/mode7_windows_x86_64.zip";

	$LYCHEEJS_FERTILIZER auto /projects/over-there;
	mv "$LYCHEEJS_ROOT/projects/over-there/build/over-there_browser_all.zip"    "$PROJECT_ROOT/release/over-there_browser_all.zip";
	mv "$LYCHEEJS_ROOT/projects/over-there/build/over-there_linux_x86_64.zip"   "$PROJECT_ROOT/release/over-there_linux_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/over-there/build/over-there_osx_x86_64.zip"     "$PROJECT_ROOT/release/over-there_osx_x86_64.zip";
	mv "$LYCHEEJS_ROOT/projects/over-there/build/over-there_windows_x86_64.zip" "$PROJECT_ROOT/release/over-there_windows_x86_64.zip";


	# $LYCHEEJS_FERTILIZER html/main /projects/boilerplate;
	# $LYCHEEJS_FERTILIZER html/main /projects/lethalmaze;
	# $LYCHEEJS_FERTILIZER html/main /projects/mode7;
	# $LYCHEEJS_FERTILIZER html/main /projects/over-there;

	$LYCHEEJS_FERTILIZER html/main /projects/flappy;
	$LYCHEEJS_FERTILIZER html/main /projects/flappy-bnn;
	$LYCHEEJS_FERTILIZER html/main /projects/immune;
	$LYCHEEJS_FERTILIZER html/main /projects/pong;
	$LYCHEEJS_FERTILIZER html/main /projects/pong-bnn;
	$LYCHEEJS_FERTILIZER html/main /projects/text-chat;
	$LYCHEEJS_FERTILIZER html/main /projects/tictactoe;

	# XXX: Online Examples

	mkdir -p "$PROJECT_ROOT/build/examples/boilerplate";
	mkdir -p "$PROJECT_ROOT/build/examples/flappy";
	mkdir -p "$PROJECT_ROOT/build/examples/flappy-bnn";
	mkdir -p "$PROJECT_ROOT/build/examples/immune";
	mkdir -p "$PROJECT_ROOT/build/examples/lethalmaze";
	mkdir -p "$PROJECT_ROOT/build/examples/mode7";
	mkdir -p "$PROJECT_ROOT/build/examples/over-there";
	mkdir -p "$PROJECT_ROOT/build/examples/pong";
	mkdir -p "$PROJECT_ROOT/build/examples/pong-bnn";
	mkdir -p "$PROJECT_ROOT/build/examples/text-chat";
	mkdir -p "$PROJECT_ROOT/build/examples/tictactoe";

	cp -R $LYCHEEJS_ROOT/projects/boilerplate/build/html/main/* $PROJECT_ROOT/build/examples/boilerplate/;
	cp -R $LYCHEEJS_ROOT/projects/flappy/build/html/main/*      $PROJECT_ROOT/build/examples/flappy/;
	cp -R $LYCHEEJS_ROOT/projects/flappy-bnn/build/html/main/*  $PROJECT_ROOT/build/examples/flappy-bnn/;
	cp -R $LYCHEEJS_ROOT/projects/immune/build/html/main/*      $PROJECT_ROOT/build/examples/immune/;
	cp -R $LYCHEEJS_ROOT/projects/lethalmaze/build/html/main/*  $PROJECT_ROOT/build/examples/lethalmaze/;
	cp -R $LYCHEEJS_ROOT/projects/mode7/build/html/main/*       $PROJECT_ROOT/build/examples/mode7/;
	cp -R $LYCHEEJS_ROOT/projects/over-there/build/html/main/*  $PROJECT_ROOT/build/examples/over-there/;
	cp -R $LYCHEEJS_ROOT/projects/pong/build/html/main/*        $PROJECT_ROOT/build/examples/pong/;
	cp -R $LYCHEEJS_ROOT/projects/pong-bnn/build/html/main/*    $PROJECT_ROOT/build/examples/pong-bnn/;
	cp -R $LYCHEEJS_ROOT/projects/text-chat/build/html/main/*   $PROJECT_ROOT/build/examples/text-chat/;
	cp -R $LYCHEEJS_ROOT/projects/tictactoe/build/html/main/*   $PROJECT_ROOT/build/examples/tictactoe/;


	# XXX: Website

	cp -R $PROJECT_ROOT/source/* $PROJECT_ROOT/build/;
	cp $LYCHEEJS_ROOT/bin/maintenance/do-netinstall.sh $PROJECT_ROOT/build/install.sh;

	cd $PROJECT_ROOT;
	"$LYCHEEJS_HELPER" env:node ./bin/build.js;

	echo "SUCCESS";
	exit 0;

else

	echo "FAILURE";
	exit 1;

fi;

