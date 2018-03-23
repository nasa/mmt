
## Configure environment to run MMT over HTTPS locally, to be able to authenticate with Launchpad

When running MMT with Launchpad Authentication, MMT should be configured to run at https://mmt.localtest.earthdata.nasa.gov. The url will need to be configured to redirect to `localhost:4000`:

  1. Modify `/etc/hosts`
    Append 'mmt.localtest.earthdata.nasa.gov' to the 127.0.0.1 localhost line

      127.0.0.1 localhost mmt.localtest.earthdata.nasa.gov

  2. Install Nginx

      brew install nginx

  3. Generate the self-signed certificate (see references below)
    a. Create the Certificate Configuration File
      In a new certificates folder:

        sudo nano mmt.localtest.earthdata.nasa.gov.conf

      Paste the following into the configuration file:
      ```
      [ req ]
      default_bits        = 2048
      default_keyfile     = server-key.pem
      distinguished_name  = subject
      req_extensions      = req_ext
      x509_extensions     = x509_ext
      string_mask         = utf8only

      [ subject ]
      countryName                 = Country Name (2 letter code)
      countryName_default         = US
      stateOrProvinceName         = State or Province Name (full name)
      stateOrProvinceName_default = DC
      localityName                = Locality Name (eg, city)
      localityName_default        = Washington
      organizationName            = Organization Name (eg, company)
      organizationName_default    = NASA
      commonName                  = Common Name (e.g. server FQDN or YOUR name)
      commonName_default          = MMT
      emailAddress                = Email Address
      emailAddress_default        = test@example.com

      [ x509_ext ]
      subjectKeyIdentifier   = hash
      authorityKeyIdentifier = keyid,issuer
      basicConstraints       = CA:FALSE
      keyUsage               = digitalSignature, keyEncipherment
      subjectAltName         = @alternate_names
      nsComment              = "OpenSSL Generated Certificate"

      [ req_ext ]
      subjectKeyIdentifier = hash
      basicConstraints     = CA:FALSE
      keyUsage             = digitalSignature, keyEncipherment
      subjectAltName       = @alternate_names
      nsComment            = "OpenSSL Generated Certificate"

      [ alternate_names ]
      DNS.1   = mmt.localtest.earthdata.nasa.gov
      DNS.2   = localhost:4000
      ```

    b. Create the self signed Certificate

      openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.key -out /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.crt

    when prompted with questions for the certificate, leave them blank so information from the configuration file will be used by default

    c. Copy the Certificate Key Pair to the nginx folder

        sudo cp mmt.localtest.earthdata.nasa.gov.crt /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.crt

        sudo cp mmt.localtest.earthdata.nasa.gov.key /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.key

  4. Add the certificate to Mac OSX Keychain
    a. Open the certificate in Keychain Access

        open /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.crt

    b. Ensure the certificate is added to the System keychain

    c. Ensure the certificate is trusted:
    Double click on the certificate
    Open the Trust section
    For the dropdown next to 'When using this certificate' choose 'Always Trust'
    You may need to enter your password to make these changes

  5. Update the Nginx Configuration File to load the certificate key pair and handle the url redirect
  Add the following to the nginx.conf file (`/usr/local/etc/nginx/nginx.conf`):

    ```
    ssl_certificate /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.crt;
    ssl_certificate_key /usr/local/etc/nginx/mmt.localtest.earthdata.nasa.gov.key;

    server {
      listen 443 ssl;
      server_name mmt.localtest.earthdata.nasa.gov;
      ssl on;
      ssl_session_cache shared:SSL:1m;
      ssl_session_timeout 5m;
      ssl_ciphers HIGH:!aNULL:!MD5;
      ssl_prefer_server_ciphers on;
      location / {
        root html;
        index index.html index.htm;

        proxy_pass http://mmt.localtest.earthdata.nasa.gov:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
      }
    }
    ```
  6. Start nginx:

      sudo nginx

    if nginx is already running you can stop it first with `sudo nginx -s stop`

  7. Run the rails server on the appropriate port:

      rails s -p 4000

And if you need to stop the server from running, hit `Ctrl + C` and the server will shutdown.

You should be able to visit MMT at http://localhost:4000 which will redirect you to Launchpad for authentication and back to the https url you added


##### References for these instructions:
[Earthdata Status App Readme instructions | https://git.earthdata.nasa.gov/projects/DOWN/repos/downtime-monitor/browse]
[Earthdata EDP SAML instructions | https://wiki.earthdata.nasa.gov/display/EDDEV/Test+EDP+SAML+locally]
https://deliciousbrains.com/https-locally-without-browser-privacy-errors/
https://www.humankode.com/ssl/create-a-selfsigned-certificate-for-nginx-in-5-minutes
