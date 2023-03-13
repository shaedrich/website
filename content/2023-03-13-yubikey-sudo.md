---
title: "Passwordless Authentication on Ubuntu with a Yubikey"
image: /images/anirudh-YQYacLW8o2U-unsplash.jpg
imageMeta:
  attribution: ANIRUDH 
  attributionLink: https://unsplash.com/photos/YQYacLW8o2U 
featured: true
authors:
  - nullvoxpopuli
date: Mon Mar 13 2023 11:40:00 GMT-0400 (Eastern Daylight Time)
tags:
  - linux
  - security
---


I've been using my desktop computer a lot more lately, and one thing I miss from my [frame.work](https://frame.work/) laptop is the passwordless authentication / passwordless sudo.
On the frame.work, it uses a fingerprint reader, which makes `sudo` a breeze. Since I've been using my desktop with its big screen, big GPU (not that I do GPU work), and faster-than-Apple-M1-maybe-same-as-M2 processor (AMD Ryzen 9), I want the same passwordless experience!

Here is how to set up passwordless authentication with a [Yubikey](https://www.yubico.com/products/yubikey-5-overview/):

```bash
sudo apt install libpam-u2f
mkdir ~/.config/Yubico # do not commit this directory to a dotfiles repo or anything like that
pamu2fcfg > ~/.config/Yubico/u2f_keys # once the light blinks on your yubikey, press the button
```

Lastly, configure the type of auth that the Yubikey will be used for by editing `/etc/pam.d/sudo`:
```diff
  # Set up user limits from /etc/security/limits.conf.
  session    required   pam_limits.so

  session    required   pam_env.so readenv=1 user_readenv=0
  session    required   pam_env.so readenv=1 envfile=/etc/default/locale user_readenv=0
+
+ auth sufficient pam_u2f.so

  @include common-auth
  @include common-account
  @include common-session-noninteractive
```

Docs for the [`pamu2fcfg`](https://packages.ubuntu.com/jammy/pamu2fcfg) util can be [found here](https://developers.yubico.com/pam-u2f/Manuals/pamu2fcfg.1.html).

For reference, my versions at the time of writing:
```
❯ lsb_release -rd
Description:	Ubuntu 22.04.2 LTS
Release:	22.04

❯ uname -r
5.15.0-43-generic
```


**What happens if you don't have your Yubikey nearby?**
You'll be asked for your `sudo` password, as you would have been previously.


**What happens if the Yubikey is not plugged in?**
You'll be asked for your `sudo` password, as you would have been previously. 
Passwordless auth is only enabled when the Yubikey is plugged in.
