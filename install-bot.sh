#!/usr/bin/env bash


LYCHEEJS_ROOT="/opt/lycheejs";
LYCHEEJS_BRANCH="development";
PACMAN=`which pacman`;



if [ "$PACMAN" == "" ]; then

	echo "This is not Arch Linux.";
	echo "Use either archlinux.org or archlinuxarm.org";

	exit 1;

fi;

if [ "$USER" != "root" ]; then

	echo "You are not root.";
	echo "Use \"sudo $0\"";

	exit 1;

fi;



echo "";
echo "lychee.js Git/Net Installer";
echo "";
echo "This installer will download and install lychee.js to $LYCHEEJS_ROOT";
echo "";



read -p "Continue (y/n)? " -r

if [[ $REPLY =~ ^[Yy]$ ]]; then
	echo "";
else
	exit 1;
fi;



echo "";
echo "Installing/Updating Dependencies ...";

	pacman -Sy --noconfirm;
	pacman -Su --noconfirm;
	pacman -S --noconfirm --needed bash sudo binutils coreutils sed zip unzip tar curl git;

echo "Done.";


echo "";
echo "Installing lychee.js Engine ...";

	if [ ! -d "$LYCHEEJS_ROOT" ]; then
		mkdir -m 0777 -p "$LYCHEEJS_ROOT";
	else
		rm -rf "$LYCHEEJS_ROOT";
		mkdir -m 0777 "$LYCHEEJS_ROOT";
	fi;


	cd "$LYCHEEJS_ROOT";

	git clone https://github.com/Artificial-Engineering/lycheejs.git ./;
	git checkout "$LYCHEEJS_BRANCH";

echo "Done.";


echo "";
echo "Installing lychee.js Runtimes ...";

	if [ ! -d "$LYCHEEJS_ROOT/bin/runtime" ]; then
		mkdir -m 0777 "$LYCHEEJS_ROOT/bin/runtime";
	else
		rm -rf "$LYCHEEJS_ROOT/bin/runtime";
		mkdir -m 0777 "$LYCHEEJS_ROOT/bin/runtime";
	fi;


	DOWNLOAD_URL=$(curl -s https://api.github.com/repos/Artificial-Engineering/lycheejs-runtime/releases/latest | grep browser_download_url | grep lycheejs-runtime | head -n 1 | cut -d'"' -f4);

	if [ "$DOWNLOAD_URL" != "" ]; then

		cd $LYCHEEJS_ROOT/bin;
		curl -sSL $DOWNLOAD_URL > $LYCHEEJS_ROOT/bin/runtime.zip;

		mkdir $LYCHEEJS_ROOT/bin/runtime;
		cd $LYCHEEJS_ROOT/bin/runtime;
		unzip ../runtime.zip;

		chmod +x $LYCHEEJS_ROOT/bin/runtime/bin/*.sh;
		chmod +x $LYCHEEJS_ROOT/bin/runtime/*/update.sh;
		chmod +x $LYCHEEJS_ROOT/bin/runtime/*/package.sh;

		rm $LYCHEEJS_ROOT/bin/runtime.zip;

	fi;

echo "Done.";


echo "";
echo "Integrating lychee.js Engine ...";

	cd $LYCHEEJS_ROOT;

	ln -s "$LYCHEEJS_ROOT/bin/fertilizer.sh" /usr/local/bin/lycheejs-fertilizer;
	ln -s "$LYCHEEJS_ROOT/bin/harvester.sh" /usr/local/bin/lycheejs-harvester;
	ln -s "$LYCHEEJS_ROOT/bin/helper.sh" /usr/local/bin/lycheejs-helper;

echo "Done."


echo "";
echo "Configuring lychee.js Engine ...";

	cd $LYCHEEJS_ROOT;

	./bin/configure.sh;

echo "Done.";


echo "";
echo "Fixing chmod Rights ...";

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
		chown -R "${user_name}:${group_name}" "$LYCHEEJS_ROOT";
	else
		chown -R "$user_name" "$LYCHEEJS_ROOT";
	fi;

echo "Done.";


echo "";
echo "Cleaning Package Cache ...";

	pacman -Scc --noconfirm;
	rm /var/cache/pacman/pkg/*.pkg.tar.xz;

echo "Done.";


echo "";
echo "Integrating systemd Service ...";

read -r -d '\n' SYSTEMD_SERVICE << ENDOFFILE
[Unit]
Description=lychee.js Harvester

[Service]
ExecStart=/bin/bash /opt/lycheejs/bin/harvester.sh start development
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


	echo "$SYSTEMD_SERVICE" > /etc/systemd/system/lycheejs-harvester.service;

	systemctl enable lycheejs-harvester.service;
	systemctl start lycheejs-harvester.service;

echo "Done.";

