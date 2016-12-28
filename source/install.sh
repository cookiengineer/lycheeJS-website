#!/usr/bin/env bash


LYCHEEJS_ROOT="/opt/lycheejs";
LYCHEEJS_BRANCH="development";
GIT_BIN=`which git`;


if [ "$USER" != "root" ]; then

	echo -e "\e[37m\e[41m";
	echo " (E) You are not root.     ";
	echo "     Use \"sudo install.sh\".";
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

read -p " (L) Continue (y/n)? " -r

if [[ $REPLY =~ ^[Nn]$ ]]; then
	echo -e "\e[37m\e[41m (E) ABORTED \e[0m";
	exit 1;
elif ! [[ $REPLY =~ ^[Yy]$ ]]; then
	echo -e "\e[37m\e[41m (E) INVALID SELECTION \e[0m";
	exit 1;
fi;



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

		echo -e "\e[37m\e[41m";
		echo " (E) No lychee.js Runtime release found.     ";
		echo "     (Possibly unstable internet connection) ";
		echo -e "\e[0m";

		echo " (L) ";
		echo " (L) Sorry, but you need to install manually :(                  ";
		echo " (L) ";
		echo " (L) 1. Download lycheejs-runtime.zip manually from              ";
		echo " (L)    https://github.com/Artificial-Engineering/lycheejs-runtime/releases/latest ";
		echo " (L) ";
		echo " (L) 2. Unzip lycheejs-runtime.zip to $LYCHEEJS_ROOT/bin/runtime ";
		echo " (L) ";
		echo " (L) 3. Install dependencies and configure lychee.js Engine:     ";
		echo " (L) ";
		echo " (L)    cd $LYCHEEJS_ROOT;                                       ";
		echo " (L)    sudo ./bin/maintenance/do-install.sh;                    ";
		echo " (L)    ./bin/configure.sh;                                      ";
		echo " (L) ";
		echo " (L)    lycheejs-harvester start development;                    ";
		echo " (L) ";

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

	echo -e "\e[37m\e[41m";
	echo " (E) Ups, something went wrong :( ";
	echo -e "\e[0m";

	echo " (L) ";
	echo " (L) Sorry, but you need to configure manually :( ";
	echo " (L) ";
	echo " (L) 1. Install dependencies and configure:       ";
	echo " (L) ";
	echo " (L)    cd $LYCHEEJS_ROOT;                        ";
	echo " (L)    sudo ./bin/maintenance/do-install.sh;     ";
	echo " (L)    ./bin/configure.sh;                       ";
	echo " (L) ";
	echo " (L)    lycheejs-harvester start development;     ";
	echo " (L) ";

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

	echo -e "\e[37m\e[41m";
	echo " (E) Ups, something went wrong :( ";
	echo -e "\e[0m";

	echo " (L) ";
	echo " (L) Sorry, but you need to configure manually :( ";
	echo " (L) ";
	echo " (L) 1. Configure lychee.js Engine:               ";
	echo " (L) ";
	echo " (L)    cd $LYCHEEJS_ROOT;                        ";
	echo " (L)    ./bin/configure.sh;                       ";
	echo " (L) ";
	echo " (L)    lycheejs-harvester start development;     ";
	echo " (L) ";

	exit 1;

fi;



echo " (L) ";
echo " (L) > Fixing chmod rights ...";

cd $(dirname $LYCHEEJS_ROOT);

user_group=$(cat /etc/group | grep "^$SUDO_USER");
wheel_group=$(cat /etc/group | grep "^wheel");
staff_group=$(cat /etc/group | grep "^staff");
sudo_group=$(cat /etc/group | grep "^sudo");

user_name="$SUDO_USER";
group_name="";

if [ "$user_group" != "" ]; then
	group_name="$SUDO_USER";
elif [ "$wheel_group" != "" ]; then
	group_name="wheel";
elif [ "$staff_group" != "" ]; then
	group_name="staff";
elif [ "$sudo_group" != "" ]; then
	group_name="sudo";
fi;

if [ "$group_name" != "" ]; then
	echo " (L)   chown -R \"${user_name}:${group_name}\" $LYCHEEJS_ROOT";
	chown -R "${user_name}:${group_name}" "$LYCHEEJS_ROOT" 2> /dev/null;
else
	echo " (L)   chown -R \"$user_name\" $LYCHEEJS_ROOT";
	chown -R "$user_name" "$LYCHEEJS_ROOT" 2> /dev/null;
fi;

echo -e "\e[37m\e[42m (I) > SUCCESS \e[0m";



echo " (L) ";
echo " (L) Everything is ready.                  ";
echo " (L) Start the lychee.js Harvester now:    ";
echo " (L) ";
echo " (L) ";
echo " (L) cd $LYCHEEJS_ROOT;                    ";
echo " (L) lycheejs-harvester start development; ";
echo " (L)";

