#!/bin/bash

#
# This do-netinstall.sh script can be remotely executed
# and will lead to a local lychee.js Engine installation.
#
# Usage: sudo bash -c "$(curl -fsSL https://lychee.js.org/install.sh)";
#
# (assuming lychee.js.org/install.sh leads to this file)
#

lowercase() {
	echo "$1" | sed "y/ABCDEFGHIJKLMNOPQRSTUVWXYZ/abcdefghijklmnopqrstuvwxyz/";
}

OS=`lowercase \`uname\``;
OS_EMULATOR="false";
GIT_BIN=`which git`;
USER_WHO=`whoami`;
USER_LOG=`logname 2> /dev/null`;
SUDO_BIN=`which sudo`;
LYCHEEJS_ROOT="/opt/lycheejs";
UPDATE_FLAG="";

NAME_USER="$USER_WHO";
NAME_GROUP="";

if [ "$USER_WHO" == "root" ]; then

	# XXX: Allow sudo usage
	if [ "$SUDO_USER" != "" ]; then
		USER_WHO="$SUDO_USER";
	fi;


	if [ -f /etc/group ]; then

		wheel_group=$(cat /etc/group | grep "^wheel");
		staff_group=$(cat /etc/group | grep "^staff");
		user_group=$(cat /etc/group | grep "^$USER_WHO");
		sudo_group=$(cat /etc/group | grep "^sudo");


		NAME_USER="$USER_WHO";
		NAME_GROUP="";

		if [ "$wheel_group" != "" ]; then
			NAME_GROUP="wheel";
		elif [ "$staff_group" != "" ]; then
			NAME_GROUP="staff";
		elif [ "$user_group" != "" ]; then
			NAME_GROUP="$USER_WHO";
		elif [ "$sudo_group" != "" ]; then
			NAME_GROUP="sudo";
		fi;

	fi;

fi;


if [ "$OS" == "darwin" ]; then

	OS="osx";

elif [ "$OS" == "linux" ]; then

	OS="linux";

	OS_CHECK=`lowercase \`uname -o\``;

	if [ "$OS_CHECK" == "android" ]; then

		OS_EMULATOR="true";

		TERMUX_CHECK=`which termux-info`;

		if [ "$TERMUX_CHECK" != "" ] && [ -d "/sdcard" ]; then
			LYCHEEJS_ROOT="/sdcard/opt/lycheejs";
			UPDATE_FLAG="--only-node";
		elif [ "$TERMUX_CHECK" != "" ] && [ -d "/storage/emulated/0" ]; then
			LYCHEEJS_ROOT="/storage/emulated/0/opt/lycheejs";
			UPDATE_FLAG="--only-node";
		fi;

	elif [ "$OS_CHECK" != "gnu/linux" ]; then
		OS_EMULATOR="true";
	fi;

elif [ "$OS" == "freebsd" ] || [ "$OS" == "netbsd" ]; then

	OS="bsd";

fi;



if [ "$USER" != "root" ]; then

	if [ "$OS_EMULATOR" == "false" ]; then

		echo -e "\e[37m\e[41m";
		echo " (E) You are not root.";
		echo "     Use \"sudo $0\".";
		echo -e "\e[0m";

		exit 1;

	fi;

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
echo " (L) Download size is ~50MB + ~700MB + dependencies. ";
echo " (L) Installation size is ~2.0GB.                    ";
echo " (L) ";

read -p " (L) Continue (y/n)? " -r

if [[ $REPLY =~ ^[Nn]$ ]]; then
	echo -e "\e[37m\e[41m";
	echo " (E) ABORTED                                ";
	echo " (E) Have a nice, long and unautomated day. ";
	echo -e "\e[0m";
	exit 1;
elif ! [[ $REPLY =~ ^[Yy]$ ]]; then
	echo -e "\e[37m\e[41m (E) INVALID SELECTION \e[0m";
	exit 1;
fi;



echo " (L) ";
echo " (L) > Installing lychee.js Engine ...";
echo " (L)   (This might take a while)";

if [ ! -d "$LYCHEEJS_ROOT" ]; then
	mkdir -m 0777 -p "$LYCHEEJS_ROOT" 2> /dev/null;
else
	chmod 0777 "$LYCHEEJS_ROOT" 2> /dev/null;
fi;


echo " (L)   git clone https://github.com/Artificial-Engineering/lycheejs.git $LYCHEEJS_ROOT";

if [ "$SUDO_USER" != "" ]; then
	sudo -u "$SUDO_USER" $GIT_BIN clone https://github.com/Artificial-Engineering/lycheejs.git $LYCHEEJS_ROOT;
else
	$GIT_BIN clone https://github.com/Artificial-Engineering/lycheejs.git $LYCHEEJS_ROOT;
fi;

if [ $? == 0 ]; then

	echo " (L)   cd $LYCHEEJS_ROOT";
	echo " (L)   git checkout development";

	cd "$LYCHEEJS_ROOT";

	if [ "$SUDO_USER" != "" ]; then
		sudo -u "$SUDO_USER" $GIT_BIN checkout "development";
	else
		$GIT_BIN checkout "development";
	fi;

fi;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



if [ "$OS" == "linux" ] || [ "$OS" == "osx" ] || [ "$OS" == "bsd" ]; then

	if [ "$USER_WHO" == "root" ]; then

		if [ "$NAME_GROUP" != "" ]; then
			echo " (L)   cd $LYCHEEJS_ROOT";
			echo " (L)   chmod -R \"${NAME_USER}:${NAME_GROUP}\" $LYCHEEJS_ROOT";
			cd $LYCHEEJS_ROOT;
			chown -R "${NAME_USER}:${NAME_GROUP}" $LYCHEEJS_ROOT 2> /dev/null;
		else
			echo " (L)   cd $LYCHEEJS_ROOT";
			echo " (L)   chmod -R \"$NAME_USER\" $LYCHEEJS_ROOT";
			cd $LYCHEEJS_ROOT;
			chown -R "${NAME_USER}:${NAME_GROUP}" $LYCHEEJS_ROOT 2> /dev/null;
			chown -R "$NAME_USER" $LYCHEEJS_ROOT 2> /dev/null;
		fi;

	fi;

fi;



echo " (L) ";
echo " (L) > Integrating lychee.js Engine ...";
echo " (L)   (This might take a while)";
echo " (L)   cd $LYCHEEJS_ROOT";
echo " (L)   bash ./bin/maintenance/do-install.sh --yes";

cd $LYCHEEJS_ROOT;

# XXX: do-install.sh has to be executed as root
bash ./bin/maintenance/do-install.sh --yes;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



echo " (L) ";
echo " (L) > Updating lychee.js Runtimes ...";
echo " (L)   (This might take a while)";

if [ "$UPDATE_FLAG" != "" ]; then

	echo " (L)   cd $LYCHEEJS_ROOT";
	echo " (L)   bash ./bin/maintenance/do-update.sh --development --yes $UPDATE_FLAG";

	if [ "$SUDO_USER" != "" ]; then
		cd $LYCHEEJS_ROOT;
		sudo -u "$SUDO_USER" bash ./bin/maintenance/do-update.sh --development --yes "$UPDATE_FLAG";
	else
		cd $LYCHEEJS_ROOT;
		bash ./bin/maintenance/do-update.sh --development --yes "$UPDATE_FLAG";
	fi;

else

	echo " (L)   cd $LYCHEEJS_ROOT";
	echo " (L)   bash ./bin/maintenance/do-update.sh --development --yes";

	if [ "$SUDO_USER" != "" ]; then
		cd $LYCHEEJS_ROOT;
		sudo -u "$SUDO_USER" bash ./bin/maintenance/do-update.sh --development --yes;
	else
		cd $LYCHEEJS_ROOT;
		bash ./bin/maintenance/do-update.sh --development --yes;
	fi;

fi;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



echo " (L) ";
echo " (L) > Configuring lychee.js Engine ...";
echo " (L)   cd $LYCHEEJS_ROOT";
echo " (L)   bash ./bin/configure.sh";

cd $LYCHEEJS_ROOT;

if [ "$SUDO_USER" != "" ]; then
	sudo -u "$SUDO_USER" bash ./bin/configure.sh;
else
	bash ./bin/configure.sh;
fi;

if [ $? == 0 ]; then
	echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";
else
	echo -e "\e[37m\e[41m (E) > FAILURE \e[0m";
	exit 1;
fi;



echo " (L) ";
echo " (L) lychee.js Installation is ready.      ";
echo " (L) ";
echo " (L) Start the lychee.js Harvester now:    ";
echo " (L) cd $LYCHEEJS_ROOT;                    ";
echo " (L) lycheejs-harvester start development; ";
echo " (L)";

exit 0;

