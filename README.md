# iplan

> An extraordinary ToDo app

## Planned features

* Group ToDos together to form a "Goal"
* Group Goals together to form a "Plan"
* Sync to Dropbox and GDrive
* Progressive Web App
* Package with Electron
* Chrome App Store


## Notice

Not available for end users yet. Be prepared to nuke your IndexedDB as I progress.
New features might not be compatible with older databases.

## Live demo
Available here: https://tehlordvortex.github.io/iplan.
Updated on every major feature. Or major bugfix. Sometimes randomly.


## Build Setup

Layout:
```
/
|->iplan/
|-->[master branch]
|->gh-pages/
|-->[gh-pages branch]
```

``` bash
# setup folder layout as shown above
mkdir iplan-root
cd iplan-root
mkdir iplan
mkdir gh-pages
git clone https://github.com/tehlordvortex/iplan.git iplan
git clone https://github.com/tehlordvortex/iplan.git gh-pages
cd gh-pages
git checkout gh-pages
git branch -d master

# install dependencies
yarn install

# serve with hot reload at localhost:8080
yarn run dev

# build for gh-pages
BUILD_GH_PAGES=1 yarn run build
cp dist/* ../gh-pages/

# build for production with minification
yarn run build

# build for production and view the bundle analyzer report
yarn run build --report
```

