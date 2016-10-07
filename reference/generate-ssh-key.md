---
layout: doc
title: Generating ssh Keys
redirect_to:
- https://dcos.io/
---

Before generating ssh keys, you should first check to make sure you don’t already have a key.  By default, a user’s ssh keys are stored in that user’s `~/.ssh` directory. You can easily check to see if you have a key already by going to that directory and listing the contents:

{% highlight bash %}
$ cd ~/.ssh
$ ls
google_compute_engine.pub	id_boot2docker.pub		id_rsa.pub
google_compute_engine		id_boot2docker			id_rsa				known_hosts
{% endhighlight %}

You’re looking for a pair of files named something and something.pub, where the something is usually `id_dsa` or `id_rsa`. The .pub file is your public key, and the other file is your private key. If you don’t have these files (or you don’t even have a .ssh directory), you can create them by running a program called ssh-keygen, which is provided with the ssh package on Linux/Mac systems:

{% highlight bash %}
$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/kensipe/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/kensipe/.ssh/id_rsa.
Your public key has been saved in /Users/kensipe/.ssh/id_rsa.pub.
The key fingerprint is:
43:c5:5b:5f:b1:f1:50:43:ad:20:a6:92:6a:1f:9a:3a kensipe@ThunderDo-7.local
{% endhighlight %}

First it confirms where you want to save the key (.ssh/id_rsa), and then it asks twice for a passphrase, which you can leave empty if you don’t want to type a password when you use the key.

 <div class="alert alert-danger" role="alert">
 	<strong>WARNING:</strong>
 	It is never appropriate to share your private key!
 </div>

It is never appropriate to share your private key (`id_rsa`).  Many secure services may request your public key ('id_rsa.pub').  Sharing your public key may mean uploading the `id_rsa.pub` file, or copying the contents of your public key into an administrative interface.  The public keys look something like this:

{% highlight bash %}
$ cat ~/.ssh/id_rsa.pub
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCvMRycq+kzeb62vIHaJGIqWgrmkFVPdUM51oe1wIalcVoIiLgyt9E1oDgVAoUDv7jdPRZupdW2R/E3FdLZY+1qy0JIiuxqILvclmcxBdHvY+2CX0guKeocaXvEz9AppEUk8ve+zj10yP5ALeKAK3s9lYRKDJagJTIlXW+OnhaLMPDGHNAp/6h8obD6vV9rXUbTy6UvfZMa0NWgEX8J7vTPdoZbe0mHOpzSAVdyfXD7vLSJ2rxL0JSoTi+TgejZ15aZuWdKFP4i7AkTkbRMDFmp/0s1KS5ZDT1prBrD2vqfVi9DT8haNwL4FlCSVLWaIHb16Zex0WJs7NI6DKpjxHk1 kensipe@ubuntu
{% endhighlight %}

Below are platform specific ways to copy the public key into your clipboard ready for pasting:

{% highlight bash %}
# Mac OSX
pbcopy < ~/.ssh/id_rsa.pub

# ubuntu | redhat (xsel must be installed)
cat ~/.ssh/id_rsa.pub | xsel --clipboard --input
{% endhighlight %}
