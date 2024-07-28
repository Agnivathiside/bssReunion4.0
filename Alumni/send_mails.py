import pandas as pd
import smtplib
import uuid
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os

# Load the Excel file
file_path = 'C:\\Users\\AGNIVA BHATTACHARJEE\\reunion\\bssReunion\\static\\field_names.xlsx'
df = pd.read_excel(file_path)

# Strip leading/trailing spaces from column names
df.columns = df.columns.str.strip()

# Check the column names
print(df.columns)

# Function to generate unique registration ID
def generate_registration_id():
    id = str(uuid.uuid4())
    lis = id.split("-")
    return "BSS - "+lis[-1]
    # return str(uuid.uuid4())

# SMTP configuration
smtp_server = 'smtp.gmail.com'  # For Gmail
smtp_port = 587  # Typically 587 for TLS, 465 for SSL
smtp_user = 'alumni.bss@gmail.com'
smtp_password = 'yamj flmf wiky sgsw'

# Function to send email
def send_email(to_email, registration_id, first_name):
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = 'Welcome to the Alumni Association'

    # HTML content
    html = f"""
    <html>
    <body>
        <p>Dear {first_name},</p>
        <p>Yes, now you are a part of the alumni association.</p>
        <p>Your registration ID is: <strong>{registration_id}</strong></p>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, 'html'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())
        server.quit()
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")

# Add a new column for registration IDs
df['Registration ID'] = df.apply(lambda row: generate_registration_id(), axis=1)

# Iterate over each row and send email
for index, row in df.iterrows():
    first_name = row['First Name']
    email = row['Email id']
    registration_id = row['Registration ID']
    send_email(email, registration_id, first_name)

# Save the updated Excel file
updated_file_path = os.path.join(os.path.dirname(file_path), 'updated_field_names.xlsx')
df.to_excel(updated_file_path, index=False)
print(f"Updated Excel file saved as '{updated_file_path}'")
