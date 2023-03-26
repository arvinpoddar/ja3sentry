# ja3sentry
A Chrome extension for identifying signs of malicious activity through client TLS fingerprinting.

Contains multiple components:
- Echo Server: Mirrors TLS Client Hello handshake packet data back to the client, including calculated JA3 data for the client.

## EC2 Deployment Documentation

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
10. In the `echo-server`'s' `https_server.py` file, change the `PORT` to be `443`, change the `HOST` to `0.0.0.0`, and point the certificate variables to the paths above.
11. Install dependencies with `pip3 install -r requirements.txt`
12. Run the server with `sudo https_server.py`. The `sudo` is necessary so our app can run on port 443, which is privileged.
13. Go to `echo.ja3sentry.com` to test that the server is working.
