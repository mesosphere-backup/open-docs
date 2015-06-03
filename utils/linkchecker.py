#!/usr/bin/python

from email.mime.text import MIMEText
import os
import smtplib
import subprocess

print ("Running linkchecker")

try:
	linkchecker_output = subprocess.check_output(
		['linkchecker',
		'--ignore-url=linkedin',
		'--ignore-url=^http://10',
		'--no-status',
		'--no-warnings',
		'http://mesosphere.com'])
except subprocess.CalledProcessError as e:
	linkchecker_output = e.output

print ("linkchecker_output")

mandrill_key = os.environ['MANDRILL_KEY']

print ("Sending email")

html = """\
<html>
  <body>
    <pre>
{}
    </pre>
  </body>
</html>
""".format(linkchecker_output)

me = "Sunil Shah <sunil@mesosphere.io>"
you = "docs@mesosphere.io"

msg = MIMEText(html, 'html')
msg['Subject'] = "Broken Links"
msg['From'] = me
msg['To'] = you

s = smtplib.SMTP_SSL("smtp.mandrillapp.com")
s.login("ross@mesosphere.io", mandrill_key)
s.sendmail(me, you, msg.as_string())
s.quit()