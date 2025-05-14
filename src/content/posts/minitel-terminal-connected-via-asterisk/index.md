---
title: Minitel Terminal Connected via Asterisk
date: 2024-12-30
tags: 
- nostalgia
- hardware
- python

---

I took some time during the holiday to get the Minitel I inherited from the parents-in-law connected to my home server.
As I already run Asterisk on the server and have analogue telephony hardware, I wanted to use the analogue dialup modem 
 rather than opting for the serial port available on some Minitel terminals.

Overall the setup is:

Analogue Phone + Minitel Terminal => Grandstream ATA => Asterisk => [SoftModem](https://github.com/johnnewcombe/asterisk-Softmodem) => Python [Minitel Server](https://github.com/BwanaFr/minitel-server)

Here is a video showing initial connection and navigating to some adult content of the era:

{{< youtube videoId="cCO2UKCH4wk">}}

<!--more-->

Apart from soldering some raw wires onto the French phone plug, the Minitel terminal remains unmodified:

{{< figure src="images/connector.jpg" width="30%">}}

Most of the work to get this up and running was covered in this excellent blog entry: [Building a Standalone Softmodem Enabled PABX
](https://glasstty.com/building-a-standalone-softmodem-enabled-pabx/) 🙏

Things went quite smoothly until I got stuck with garbled text on the screen when connecting to the Minitel server. After checking
the analogue side of things (and also successfully connecting to the Telstar service hosted at https://glasstty.com) I started to suspect
byte processing logic in the Python Minitel server... 

Indeed, the issue turned out to be that the Minitel server had been developed to work with the original version of the Softmodem code which does not perform
parity processing. Hence the Minitel server was performing this. As I was using a more up to date fork of the Softmodem, it was already performing the parity processing: https://github.com/johnnewcombe/asterisk-Softmodem. 

I created a fork of the Minitel server allowing parity processing to be disabled: https://github.com/vectronic/minitel-server
With this patch in place I was able to get it all working on FreeBSD with Asterisk 18. 🥳

Now I need to find an idea of what to connect this thing to rather than just local test and demo services....🤔

### Further Details and Notes

**Asterisk 18 and Softmodem Installation**

In a FreeBSD jail:

```shell
pkg update && pkg upgrade
pkg install git
git clone --depth 1 https://git.FreeBSD.org/ports.git /usr/ports
```

Edit `/usr/ports/Templates/config.site` and change `${ac_cv_header_byteswap_h=yes}` to `no`

```shell
setenv ALLOW_UNSUPPORTED_SYSTEM 1
cd /usr/ports/net/asterisk18
make
curl https://raw.githubusercontent.com/johnnewcombe/asterisk-Softmodem/app_softmodem/app_softmodem.c > /usr/ports/net/asterisk18/work/asterisk-18.25.0/apps/app_softmodem.c
```

Edit `/usr/ports/net/asterisk18/work/asterisk-18.25.0/apps/app_softmodem.c` and add at the top:

```c
#define TRUE 1
#define FALSE 1
```

```shell
cd /usr/ports/net/asterisk18/work/asterisk-18.25.0
make menuselect
make 
cd /usr/ports/net/asterisk18/
make deinstall 
make

pw groupmod -n asterisk -g 1001
pw group mod asterisk -m asterisk
chown -R asterisk:asterisk /usr/local/etc/asterisk/ /usr/local/lib/asterisk /usr/local/share/asterisk
chmod 644 /usr/local/etc/asterisk/*
```

**Asterisk Configuration Files**

```shell
root@asterisk:~ # cat /usr/local/etc/asterisk/pjsip.conf
[transport-udp]
type=transport
protocol=udp
bind=192.168.22.22

[6000]
type=endpoint
context=foo
disallow=all
allow=ulaw
transport=transport-udp
auth=commonauth
aors=6000

[commonauth]
type=auth
auth_type=userpass
username=xxx
password=xxx

[6000]
type=aor
max_contacts=1
```

```shell
root@asterisk:~ # cat /usr/local/etc/asterisk/extensions.conf
[foo]

exten = 1,1,Dial(PJSIP/6000,20)

exten => 3610,1,Answer()
exten => 3610,n,Softmodem(127.0.0.1,3610,v(V23)ld(7)s(1)e)
exten => 3610,n,Hangup()

exten => 3611,1,Answer()
exten => 3611,n,Softmodem(127.0.0.1,3611,v(V23)ld(7)s(1)e)
exten => 3611,n,Hangup()

exten => 3614,1,Answer()
exten => 3614,n,Softmodem(127.0.0.1,3614,v(V23)ld(7)s(1)e)
exten => 3614,n,Hangup()

exten => 3615,1,Answer()
exten => 3615,n,Softmodem(127.0.0.1,3615,v(V23)ld(7)s(1)e)
exten => 3615,n,Hangup()
```

**Minitel Server Setup**

```shell
git clone --depth 1 https://github.com/vectronic/minitel-server.git
```

Edit `minitel-server/constant.py` and change `PROCESS_PARITY` from `True` to `False`

Setup the server to run on boot (I know, I know, this needs to be changed to a non-root user):

```shell
root@asterisk:~ # cat /usr/local/etc/rc.d/minitel
#!/bin/sh

# PROVIDE: minitel
# REQUIRE: LOGIN
# KEYWORD: shutdown

. /etc/rc.subr

name=minitel
rcvar=minitel_enable

load_rc_config $name

: ${minitel_enable="NO"}
: ${minitel_home_dir:="/root/minitel-server"}

pidfile="/var/run/${name}.pid"
command=/usr/sbin/daemon
command_args="-f -P ${pidfile} -u root /bin/sh -c 'cd /root/minitel-server && /usr/local/bin/python3.11 MinitelSrv.py'"

run_rc_command "$1"
```

**Start Services**

```shell
sysrc asterisk_enable="YES"
sysrc minitel_enable="YES"

service asterisk start
service minitel start
```
 
