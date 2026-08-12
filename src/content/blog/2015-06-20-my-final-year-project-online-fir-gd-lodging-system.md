---
title: 'My Final Year Project aka Online FIR/GD lodging system.'
excerpt: 'A college final-year Django project for lodging FIRs/General Diaries online, using government ID verification, Site2SMS OTPs backed by Redis, and PDF report generation via email.'
publishDate: '2015-06-20'
tags:
  - openSource
  - Django
  - Final_Year_Project
---

Hello all, this post will be a small one. I will be discussing about my College Final Year project in here. The topic for my project was **Online FIR/GD Lodging System.** Since I have worked with Flask before, I chose Django 1.8 to try something new. Learning the basics of Django wasn't much difficult. Now my college stuff is over but i have decided to add on a few more features.

### about THE Application

Its a simple web-app with a Form to fill up the details necessary for lodging an FIR/GD. The main problem with this kind of application is the identity of the user. So to properly identify i decided to use approved ID Proofs by the Government for different organizations i.e Voter ID Number, Aadhaar ID Number, Ration Card Number, PAN Card Number. Obviously this a prototype so I had the freedom to use dummy data for users Aadhaar, Voter and PAN card in database tables. For Practical implementation it surely needs access to the above mentioned databases from the government. So a user can choose any two ID proof out of the 4 and fill in the details. The two ID card data must have same name and birth date for the user to be identified. Next the Report(FIR/GD) form is to be filled by the person. Also currently he needs to explicitly select the Police Station he wants to lodge the report to. According to the city and state the police stations gets shortlisted. Next the form is submitted. I did not use User Auth in this application. We already have the user identity but we need ways to contact the user, hence phone number and email needs to be filled in the Form. Next comes the verification of mobile number. I really didn't want to spend much on this so decided to use Site2SMS API which allows you to send limited Free SMS. So sending OTP via Site2SMS API. Since the OTP are short-lived (5 minutes) i decided not to use database to avoid overhead due to frequent writes and decided to use Redis instead. The TTL feature made my work of expiring OTPs easy. Finally sending a pdf document report via email. I used xhtml2pdf to generate the pdf's and again saving money by using Gmail for sending out emails. 😉 That pretty much sums up the application. You can check out the [SourceCode](https://github.com/Ghost-script/Online-FIR-General-Diary-lodging-System).

### Future Plans

– Right now all I have done is for the user who wants to lodge an FIR/GD. The police portal exists but the Reports are not updated instantly. I am planning to use Django Signals to work with django-socketio to update the new Reports instantly just after they are inserted into database.

– Chalk out a way to automatically register the FIR/GD to the correct police station depending on the location of event

– This can be most handy when used as a mobile application. So either create an API and mobile application or make the design responsive to suit any device.

– And finally to write Unit tests. ( This is my new year resolution) 😛

P.S.- Suggest some cool name for this app.
P.P.S.- You are most welcome to request a feature or add a feature and send a PR on Github.

This year Fudcon is from 26th. Will be attending it and maybe meeting some of you. Next post will be on [FUDCON 2015](http://fudcon.in/). Till then Happy Coding. 🙂
