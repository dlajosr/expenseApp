# Salesforce Expense App

This is the github repository of the SF expense App

## Instructions to install

1. Clone this repository

<code>git clone https://github.com/dlajosr/expenseApp.git</code>

2. Connect to your Trailhead Playground

<code>sfdx auth:web:login --setalias MyTP</code>

3. Install the unlocked package

<code>sfdx force:package:install --targetusername MyTP --wait 10 --package expenseApp@1.0.0-1 --installationkey test1234 --noprompt</code>

4. Open the org to your new app

<code>sfdx force:org:open --path lightning/n/Tracker1 --targetusername MyTP</code>

5. You're ready to register your company's expenses. Enjoy!