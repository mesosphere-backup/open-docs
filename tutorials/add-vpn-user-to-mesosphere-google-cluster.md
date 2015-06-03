---
layout: doc
title: Adding a VPN User to a Mesosphere Cluster on Google Cloud Platform
---

Mesosphere for Google Cloud Platform automatically creates a single VPN user and configures the VPN on clusters that it provisions. However, as yet, it is unable to automatically add VPN users. OpenVPN allows you to share the generated configuration but multiple users cannot connect simultaneously and may see no or intermittent connectivity if they do. The following steps outline how you can easily create and generate credentials for another VPN user account.


***

## Prerequisites

* Cluster created using [Mesosphere on Google Cloud Platform](https://google.mesosphere.io)


***

## SSH to the VPN Node

Once you have a cluster created and are connected to its VPN, navigate to the [Mesosphere Launchpad](https://google.mesosphere.io/clusters) for cluster details.  From the Launchpad, select the cluster of interest and scroll to the topology section at the bottom.

<img src="{% asset_path learn/mesosphere-launchpad.png %}" alt="" width="60%">

Find the IP address of the VPN Endpoint, replacing the dummy IP address `1.2.3.4` in the command below, and SSH to it from your favorite terminal program:

{% highlight bash %}
ssh jclouds@1.2.3.4
{% endhighlight %}


***

## Generate Credentials

In order to generate credentials for another user, we will make use of the provided OpenVPN utility. First it's necessary to set up some environment variables and run a `clean-all` script:
{% highlight bash %}
source /etc/openvpn/easy-rsa/vars
export KEY_COUNTRY="US"
export KEY_PROVINCE="CA"
export KEY_CITY="SanFrancisco"
export KEY_ORG="Mesosphere, Inc."
export KEY_EMAIL="support@mesosphere.io"
export KEY_CN="Mesosphere, Inc"
export KEY_OU="Mesosphere, Inc."
/etc/openvpn/easy-rsa/clean-all
{% endhighlight %}


Once these are done, we can create new client credentials for as many users as you like, changing the value of `KEY_NAME`  and the argument to `pkitool` to something different for each client:
{% highlight bash %}
export KEY_NAME="cluster123-client"
sh -c "cd /etc/openvpn/easy-rsa/ && ./pkitool cluster123-client"
{% endhighlight %}

This will create two files each time is it called in the `/etc/openvpn/easy-rsa/keys/` directory: `cluster123-client.crt` and `cluster123-client.key`.

***
## Create OpenVPN client configuration

Finally, we'll want to create a new client configuration for each new pair of keys. To do this:

1. Copy the original *.ovpn file you downloaded when creating the cluster
2. Open it in a text editor
3. Replace the blob within the `<cert> </cert>` tags with the contents of `cluster123-client.crt`
4. Replace the blob within the `<key> </key>` tags with the contents of `cluster123-client.key`.
5. Save this as a new file.
6. Repeat for each new pair of keys.

***
## Use new client configuration

To use these new configurations, simply [connect as you would with the original configuration](/getting-started/cloud/setting-up-mesosphere-vpn/) but opening the new configuration instead!

Provide feedback or questions to [support@mesosphere.io](mailto:support@mesosphere.io).

