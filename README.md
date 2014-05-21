##UXD_frontend##
>The project building framework for UXD-group

###Getting started###
The project building process runs with a help of task manager [Grunt] (http://gruntjs.com/). Grunt and Grunt plugins are installed and managed via [npm] (https://www.npmjs.org/), the [Node.js] (http://nodejs.org/) package manager.  
In order to get started, you need to install Grunt's command line interface (CLI) globally. (You may need to use sudo or run your command shell as Administrator to do this)
```
npm install -g grunt-cli
```
The job of the Grunt CLI is to run the version of Grunt which has been installed next to a <code>Gruntfile</code> in the appropriate project folder.

###Preparing a new project###
To start building a new project, copy [uxd frontend] (https://github.com/prokhatskiy/uxd_frontend) repository files to your project’s folder. Change to the project's root directory at the command line and run
```
npm install
```
This will install the correct version of Grunt and the Grunt plugins listed as [devDependencies] (https://www.npmjs.org/doc/json.html#devDependencies) in the <code>package.json</code> file. When you need to add Grunt plugins or other node modules to your project run
```
npm install <module> --save-dev
```
This will install <code>\<module></code> locally as well as automatically add it to the devDependencies section in the <code>package.json</code> file.

The <code>Gruntfile.js</code> belongs in the root directory of the project next to the <code>package.json</code> and is used to configure or define tasks and load Grunt plugins. At the command line run
```
grunt
```
Running <code>grunt</code> at the command line will run the default tasks listed in <code>Gruntfile</code>. When running <code>grunt</code> command for the first time, the <code>build</code> task creates a <code>build</code> folder, where the release project version will be located. The dev-version of the project is in the folder named <code>sourse</code>.
