---
layout: doc
title: Setting up VPN for Mesosphere

redirect_to:
- http://open.mesosphere.com
---

## Introduction
Mesosphere automatically configures provisioned clusters for access by both ssh and [OpenVPN](https://openvpn.net/). This prevents unauthorized access to your cluster and requires setup of an OpenVPN client to allow access to the services on your clusters (including the Mesos and Marathon web consoles).

***
## Downloading the OpenVPN Client

Download and install the OpenVPN client for your platform

* [Mac](http://sourceforge.net/projects/tunnelblick/files/All%20files/Tunnelblick_3.4.3_build_4055.4198.dmg/download)
* [Windows Vista+ 64-bit](http://swupdate.openvpn.org/community/releases/openvpn-install-2.3.4-I603-x86_64.exe)
* [Windows Vista+ 32-bit](http://swupdate.openvpn.org/community/releases/openvpn-install-2.3.4-I603-i686.exe)
* [Ubuntu](https://help.ubuntu.com/community/OpenVPN)
* [Debian](https://wiki.debian.org/OpenVPN)
* [Others](https://openvpn.net/index.php/open-source/downloads.html)

Installation will require admin rights on your machine.

***
## Configuring your client

A link to download your VPN credentials is provided at the final stage of launching your cluster on Mesosphere.  This will download a `.ovpn` file.

### Mac

To configure your client with the VPN credentials provided, simply double-click the `.ovpn` file downloaded. Tunnelblick will show a dialogue box asking you to add this configuration.

### Windows
To configure your client with the VPN credentials provided, simply double-click the `.ovpn` file downloaded. OpenVPN-GUI will open the file.

### Linux

To configure and run the OpenVPN client on Linux, simply execute the following command in your terminal, where vpn-config.ovpn is the downloaded configuration:

```sh
sudo openvpn --config ~/vpn-config.ovpn
```

***
## Connecting with VPN

On Mac or Windows, select the configuration from the icon tray to connect to your cluster.

<img src="{% asset_path vpn-selection.png %}" width="25%"  >

A status dialog will show, connect, turn green and disappear.  You are connected!

***
## Testing connectivity

You can verify your connection, by connecting to the Mesos or Marathon web console with the links provided on the Mesosphere cluster details page.  You will also be able to ssh or ping your instances via their IP addresses.
