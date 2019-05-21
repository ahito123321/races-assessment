
@echo off
echo "Generating certificates for use with CircleCI, press enter to continue"
pause
openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
openssl rsa -passin pass:x -in server.pass.key -out server.key
del server.pass.key
echo "We will now generate the server key, when promoted for a password, press enter"
echo "press enter to continue"
pause
openssl req -new -key server.key -out server.csr
echo "we will now generate the certificates, press enter to continue"
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt
echo "the key will now be encoded in BASE64 in file base64.txt, use the output for the value of SFDC_SERVER_KEY enviornment variable"
pause

type server.key > temp.txt
certutil -encode temp.txt base64.txt

pause
echo "we will now clean up, keys will be deleted"

del temp.txt
del server.key
del server.csr

echo "certificate and key generateion complete, please add server.crt to your OAuth connected app in salesforce"
pause