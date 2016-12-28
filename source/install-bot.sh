#!/usr/bin/env bash


LYCHEEJS_ROOT="/opt/lycheejs";
LYCHEEJS_BRANCH="development";
GIT_BIN=`which git`;
SYSTEMCTL_BIN=`which systemctl`;


if [ "$USER" != "root" ]; then

	echo -e "\e[37m\e[41m";
	echo " (E) You are not root.         ";
	echo "     Use \"sudo install-bot.sh\".";
	echo -e "\e[0m";

	exit 1;

fi;

if [ "$GIT_BIN" == "" ]; then

	echo -e "\e[37m\e[41m";
	echo " (E) No git found.                                ";
	echo "     Please install git with the package manager. ";
	echo -e "\e[0m";

	exit 1;

fi;



echo " (L) ";
echo -e "\e[37m\e[42m (I) lychee.js Git/Net Installer \e[0m";
echo " (L) ";
echo " (L) This installer downloads and installs lychee.js. ";
echo " (L) The installation target folder is $LYCHEEJS_ROOT ";
echo " (L) ";
echo " (L) ";
echo " (L) ";
echo " (L) > Installing lychee.js Engine ...";
echo " (L)   (This might take a while, downloading ~50MB)";

if [ ! -d "$LYCHEEJS_ROOT" ]; then
	mkdir -m 0777 -p "$LYCHEEJS_ROOT";
else
	rm -rf "$LYCHEEJS_ROOT";
	mkdir -m 0777 "$LYCHEEJS_ROOT";
fi;

echo " (L)   git clone https://github.com/Artificial-Engineering/lycheejs.git $LYCHEEJS_ROOT";
$GIT_BIN clone https://github.com/Artificial-Engineering/lycheejs.git $LYCHEEJS_ROOT;

if [ $? == 0 ]; then
	echo " (L)   cd $LYCHEEJS_ROOT";
	echo " (L)   git checkout $LYCHEEJS_BRANCH";
	cd "$LYCHEEJS_ROOT";
	$GIT_BIN checkout "$LYCHEEJS_BRANCH";
fi;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



echo " (L) ";
echo " (L) Installing lychee.js Runtimes ...";
echo " (L) (This might take a while, downloading ~500MB)";

if [ ! -d "$LYCHEEJS_ROOT/bin/runtime" ]; then
	mkdir -m 0777 "$LYCHEEJS_ROOT/bin/runtime";
else
	rm -rf "$LYCHEEJS_ROOT/bin/runtime";
	mkdir -m 0777 "$LYCHEEJS_ROOT/bin/runtime";
fi;

DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);
DOWNLOAD_SUCCESS=0;

if [ "$DOWNLOAD_URL" != "" ]; then

	DOWNLOAD_SUCCESS=1;

	cd $LYCHEEJS_ROOT/bin;
	curl -SL --progress-bar $DOWNLOAD_URL > $LYCHEEJS_ROOT/bin/runtime.zip;

	if [ $? != 0 ]; then
		DOWNLOAD_SUCCESS=0;
	fi;

	if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
		mkdir $LYCHEEJS_ROOT/bin/runtime;
		echo " (L)   cd $LYCHEEJS_ROOT/bin/runtime";
		echo " (L)   unzip -qq ../runtime.zip";
		cd $LYCHEEJS_ROOT/bin/runtime;
		unzip -qq ../runtime.zip;
	fi;

	if [ $? != 0 ]; then
		DOWNLOAD_SUCCESS=0;
	fi;

	if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
		chmod +x $LYCHEEJS_ROOT/bin/runtime/bin/*.sh     2> /dev/null;
		chmod +x $LYCHEEJS_ROOT/bin/runtime/*/update.sh  2> /dev/null;
		chmod +x $LYCHEEJS_ROOT/bin/runtime/*/package.sh 2> /dev/null;
		rm $LYCHEEJS_ROOT/bin/runtime.zip                2> /dev/null;
	fi;


	if [ "$DOWNLOAD_SUCCESS" == "1" ]; then
		echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
	else
		echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
		exit 1;
	fi;

fi;



echo " (L) ";
echo " (L) > Integrating lychee.js Engine ...";
echo " (L)   cd $LYCHEEJS_ROOT               ";
echo " (L)   ./bin/maintenance/do-install.sh ";

cd $LYCHEEJS_ROOT;
./bin/maintenance/do-install.sh;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;


echo " (L) ";
echo " (L) > Configuring lychee.js Engine ...";
echo " (L)   cd $LYCHEEJS_ROOT               ";
echo " (L)   ./bin/configure.sh              ";

cd $LYCHEEJS_ROOT;
./bin/configure.sh;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



if [ "$SYSTEMCTL_BIN" != "" ]; then

	echo " (L) ";
	echo " (L) > Integrating lycheejs-harvester.service ...";

	read -r -d '\n' SYSTEMD_SERVICE << ENDOFFILE
[Unit]
Description=lychee.js Harvester

[Service]
ExecStart=/bin/bash /opt/lycheejs/libraries/harvester/bin/harvester.sh start development
Restart=always
RestartSec=30
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=lycheejs-harvester
#User=lycheejs
#Group=lycheejs

[Install]
WantedBy=multi-user.target

ENDOFFILE


	echo "$SYSTEMD_SERVICE" > /usr/lib/systemd/system/lycheejs-harvester.service;

	if [ $? == 0 ]; then
		echo " (L)   systemctl enable lycheejs-harvester.service";
		echo " (L)   systemctl start lycheejs-harvester.service";
		systemctl enable lycheejs-harvester.service 2> /dev/null;
		systemctl start lycheejs-harvester.service  2> /dev/null;
	fi;

	if [ $? == 0 ]; then
		echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
	else
		echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	fi;

fi;
