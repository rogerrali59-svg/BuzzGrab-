**Git Workflow**

This workflow is about how to use GIT command and to add a new project
with the usage of GIT.

Steps to follow:

1\. Get the access of your project git repository from your project
platform section using PROMIS.

<img src="Pictures/100000000000068B00000191D1127342FF63EE0A.png"
style="width:17.59cm;height:4.21cm" />

2\. Follow the link and open the project repository.

3\. Press the clone icon and copy the clone with http URL.

<img src="Pictures/100000000000076C0000036119710592E1D8B8EA.png"
style="width:17.59cm;height:8.006cm" />

4\. open terminal in your workspace and write command mentioned below.

Command: git clone URL or Use command : git clone -b \<BRANCHNAME\> URL

<img src="Pictures/1000000000000780000004387C0122B3AE6D5EE6.png"
style="width:16.662cm;height:9.372cm" />

5\. If project is new than clone the base project from Gitlab.

6\. Copy the app folder of your base project and add it to the cloned
project folder.

NOTE: Don’t use capital letters for your folder name.

7\. Setup the project and change the package name of your project.

8\. Use setting icon in project directory and click to compact empty
middle packages option.

<img src="Pictures/1000000000000780000004388F9C46C69D797710.png"
style="width:16.82cm;height:7.899cm" />

9\. Replace your package name with older with the use of refactor.

10\. Check if the old name exist in the application.

<img src="Pictures/1000000000000780000004388A6B4FF97B6BC323.png"
style="width:16.515cm;height:8.287cm" />

11\. Don’t forget to change the application id in gradle file.

<img src="Pictures/1000000000000780000004384A2DF4755DB7FF75.png"
style="width:16.662cm;height:9.372cm" />

12\. And run the project after setup and your are ready to work.

13\. Checkout the dev branch other than hed branch i.e. master.

Click on the git:master link and select the New Branch option

<img src="Pictures/100000000000078000000438C3537398A9D78C51.png"
style="width:16.794cm;height:9.446cm" />

Add the branch name

<img src="Pictures/100000000000078000000438AD8A9A268ADA4CA9.png"
style="width:17.085cm;height:9.61cm" />

Now u need to add the module files except your libraries to git in the
dev branch.

14\. Now add the files to git and commit the changes.

15\. Right click on the app folder and GIT → ADD

16\. Right click on the app folder and GIT → Commit Directory

17\. In the commit Screen copy the Task link from PROMIS and paste it
into commit message.

Note: without this our commit wont be included.

<img src="Pictures/1000000000000780000004380C6BB64BDE3C5558.png"
style="width:17.59cm;height:9.894cm" />

<img src="Pictures/100000000000078000000438786AB062B22AE128.png"
style="width:17.59cm;height:9.894cm" />

And now you can commit and push the changes to git.

18\. When you are ready to push the data make sure you add your library
files to .gitignore file.

19\. After data is pushed you will be able to see two branch in the
gitlab project.

<img src="Pictures/1000000000000780000004380694DFAE4FEA071C.png"
style="width:17.59cm;height:9.894cm" />

And there you go and start the development.
