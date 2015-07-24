Mesosphere has official package repositories which connect directly to the native package management tools of your favorite Linux distribution &mdash; namely apt-get and yum &mdash; to install Mesos on top of the most common Linux distributions (RedHat, CentOS, Ubuntu and Debian).

##### Supported Distributions

+ Ubuntu 14.04 (trusty)
+ Ubuntu 13.10 (saucy)
+ Ubuntu 13.04 (raring)
+ Ubuntu 12.10 (quantal)
+ Ubuntu 12.04 (precise)
+ Debian 7 (wheezy)
+ RedHat 6
+ CentOS 6
+ RedHat 7
+ CentOS 7

##### Debian / Ubuntu

```sh
# Setup
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv E56151BF
DISTRO=$(lsb_release -is | tr '[:upper:]' '[:lower:]')
CODENAME=$(lsb_release -cs)

# Add the repository
echo "deb http://repos.mesosphere.com/${DISTRO} ${CODENAME} main" | \
  sudo tee /etc/apt/sources.list.d/mesosphere.list
sudo apt-get -y update
```

##### RedHat 6 / CentOS 6

```sh
# Add the repository
sudo rpm -Uvh http://repos.mesosphere.com/el/6/noarch/RPMS/mesosphere-el-repo-6-2.noarch.rpm
```

##### RedHat 7 / CentOS 7

```sh
# Add the repository
sudo rpm -Uvh http://repos.mesosphere.com/el/7/noarch/RPMS/mesosphere-el-repo-7-1.noarch.rpm
```
