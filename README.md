# Line Counter

## Features

VSCode Extension that adds a status bar item detailing:
* Count of the selected lines of text
* Calculates Average, Sum and Count of numbers within the text

For example if there is an image subfolder under your extension project workspace:

![main features](images/linecounter.gif)
[Recorded using LICEcap](https://www.cockos.com/licecap/)


## Known Issues

* Certain numbers will not work with summations:
  * `-3-4` will only read as `-3` or `-4` depending on which was highlighted first
