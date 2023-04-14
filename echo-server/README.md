# JA3Sentry Echo Server

The Echo server returns TLS client handshake data to the client, along with the JA3 and JA3 hash data. This project borrows from the PyJA3mas repository by [Appian](https://github.com/appian/pyja3mas). The documentation for this repository is copied below.

## Running Locally

To generate the certificate files needed in the `cert` directory, I used this command (I am running a Mac OS 12.6)

```openssl req \
  -newkey rsa:2048 \
  -x509 \
  -nodes \
  -keyout server.key \
  -new \
  -out server.crt \
  -subj /CN=localhost \
  -extensions v3_new \
  -config <(cat /System/Library/OpenSSL/openssl.cnf \
  <(printf '[v3_new]\nsubjectAltName=DNS:localhost\nextendedKeyUsage=serverAuth')) \
  -sha256 \
  -days 365
```

This will output `server.crt` and `server.key`, which I use as the certificate and private key respectively in `http_server.py`. Note, I also added thes `server.crt` to my Keychain Access with all permissions as trusted. For the original SO answer, see https://stackoverflow.com/a/64309893. From here, you can run the server with:

```
python3 https_server.py
```

This will make the server available on `https://localhost:4443`. You MUST use HTTPS, or the connection to the server will be refused.

## Deploying Echo Server to AWS EC2

1. Launch a new AWS EC2 Instance from the console (use the Quick Start menu)
    - Select Amazon Linux 2 AMI as the operating system
    - Select the `t2.micro` instance type
    - Create a key pair to SSH into our server later
    - Under network settings, allow SSH traffic from anywhere and HTTPS traffic from the internet (2 checkboxes)
2. With the new instance launched, add an A record in the domain provider to point your domain (`echo.ja3sentry.com` in our case) to the public IP address of the instance.
3. SSH into the instance using ec2-user@{instance public dns name here}
4. Install git with `sudo yum install git -y`
5. Clone this repository with git into the home directory
6. Install nginx with `sudo yum install nginx`
    - Start the server with `sudo systemctl start nginx`
    - Visit the public IP of the instance. You should see a default homepage for nginx.
7. Install pip with:
    ```
    curl -O https://bootstrap.pypa.io/get-pip.py
    python3 get-pip.py --user
    ```
8. Create a certificate with `certbot`
    - Install the EPL repository with `sudo amazon-linux-extras install epel`
    - Install `certbot` with `sudo yum install certbot python2-certbot-nginx`
    - Create the certificate with `sudo certbot --nginx -d echo.ja3sentry.com`. Follow the prompts of the tool. The resulting certificate files should be located under:
    ```
    /etc/letsencrypt/live/echo.ja3sentry.com/fullchain.pem;
    /etc/letsencrypt/live/echo.ja3sentry.com/privkey.pem;
    ```
9. Turn off `nginx` with `sudo pkill -f nginx & wait $!`
10. In the `echo-server`'s `https_server.py` file, change the `PORT` to be `443`, change the `HOST` to `0.0.0.0`, and point the certificate variables to the paths above.
11. Install dependencies with `pip3 install -r requirements.txt`
12. Run the server with `sudo python3 https_server.py`. The `sudo` is necessary so our app can run on port 443, which is privileged.
13. Go to `echo.ja3sentry.com` to test that the server is working.

## Helpful Commands
```
nohup sudo python3 ja3sentry/echo-server/https_server.py # run the Echo Server in the background
sudo systemctl start nginx # start nginx (used during HTTPS setup)
sudo pkill -f nginx & wait $! # kill nginx (used during HTTPS setup)
```

---

# PyJA3mas (Appian Project Copied Documentation)

### Background Information

When a client connects to a server via HTTPS, it utilizes SSL/TLS to create the secure connection. Each client can complete the TLS handshake in various ways, and the [JA3](https://github.com/salesforce/ja3) fingerprinting algorithm is meant to uniquely identify certain clients. With this fingerprint, we can identify specific clients on the network from a single network connection. We are able to identify everyday applications, such as Google Chrome or Firefox, as well as unique or potentially malicious clients, such as custom malware that is propagating through the network. This lightweight server makes it easy to identify these applications.

### How the HTTPS Server Works

`https_server.py` contains a barebones Python concurrent HTTPS server that maintains the minimum connection time to digest the JA3 fingerprint from the browser client.

It utilizes Polling to create a concurrent web server. When a client connects to the server, it looks for the main GET request after the TLS handshake takes place. After this, the web server returns the JA3 fingerprint, as well as the browser client/version that it parses from the User-Agent string along with the GET request.

When the server gets a new client or JA3, it logs it to STDOUT, as well as the log file.

### Running the Server

Running the server is very easy and straightforward. To install all of the requirements, run

```
pip3 install -r requirements.txt
```

Next, you will need to generate certificates for the https server to use:

```
openssl req -newkey rsa:4096 -nodes -keyout privkey.pem -x509 -days 365 -out fullchain.pem
```

Place these two `.pem` files in a directory called `certs/` for seamless use with the https server. By default, the server will search for these two files in `certs/`. This can be changed directly in the code by editing `CERTFILE` and `KEYFILE` global variables.

```
$ python3 https_server.py -h

usage: https_server.py [-h] [--debug]

optional arguments:
  -h, --help  show this help message and exit
  --debug     Turn on debug logging
```

To actually run the server:

```
python3 https_server.py
```

This will start the server on `localhost:4443` by default. You can visit `https://localhost:4443` on your browser. Make sure you inlcude `https` in front of the domain, or the browser will not connect properly. To change the host/port, go into the code and edit the `HOST` and `PORT` global variables.

By visiting the address, you should see a webpage with your browser's JA3 fingerprint, browser name, and browser version. It extracts all of this data, except for the JA3 fingerprint, from the User-Agent string your browser sends with the initial GET request.
