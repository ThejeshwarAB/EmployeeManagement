#agaram_project

Note: Please read all the contents before executing the files

The root directory is agaram and consists of css, js, node_modules, public folders
The root directory also has files of html, jpeg ans json content for some purposes

The css and js folders are from and for the bootstrap lib, so no change needed here

The public folder contains the static css file that is linked to all the html files

Rest of the files are known to perform operations as given in their respective name

As on 8 July 2020:

Login validation is performed

app.js is the node file having backend data that is connected to MongoDB
Some parts of the code are commented do execute it once ie only one time
Comment out the same parts after executing it once to avoid all confusion 

username: admin
password: 1234 

This is the default user created

Now execute login.html in lh3000

If user found login happens
If not then the login fails

More to come in near future
Critics are so very welcome 

As on 16 July 2020:

We have added fuctionality to update user contents
This can basically check if the user is present in

If yes, the values are updated in the database here

We have included login session function in this now
If the user os logged in we can now basically track

Also, logout capabilities are provided in this addon
When the logout button is clicked session gets ended

Plus, the name of the user will be displayed at top

New additions of routes are /changes & /logout
They do not have any specific routed html page

/changes is called when the update form is submitted

/logout is done whenever redlogout button is clicked

Almost done, only few more to go and complete it all
Expecting your valuable suggestions, my dear friends

As on 23 July 2020:

Prefilling of data in update page is done

New fields added: mobile number and mail
Yet to validate the mobile and mail vals

Now, update page is made into two tabs

Create, edit and delete work yet to do

More to come, way to go, hope we do it
