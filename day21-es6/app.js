'use strict';
const fs = require('fs');
const path = require('path');
const AGE_TO_GET_OLD = 3600000 * Math.random() * 100;
const DIR_PATH = '/home/kr/Downloads';

let checkIfParameterItemExist = dirPath => {
    return new Promise((resolve) => {
        let exists;
        fs.exists(dirPath, (_exists) => {
            exists = _exists;
        });
        return resolve(dirPath);
    });
};

let isDirectory = dirPath => {
    fs.stat(dirPath, (err, stats) => {
        return stats.isDirectory();
    });
};

let getTimeLastChangingOfFile = filePath =>{
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, stats) => {
            let time = new Date(stats.ctime).getTime();
            if (time) {
                return resolve(time, filePath);
            }
            return reject(err);
        });
    });
};

let deleteFileIfItIsOld = (timeOfChange, filePath) => {
    console.log(filePath);
    let now = new Date().getTime();
    let endDate = timeOfChange + AGE_TO_GET_OLD;
    if (now > endDate) {
        console.log(`file ${filePath} will be deleting`);
    }
};

let doRecursiveCleanInDirectory = dirPath => {
    fs.readdir(`${dirPath}`, (err, files) => {
        if (files) {
            files.forEach((file) => {
                let newPath = `${dirPath}/${file}`;
                if (isDirectory(newPath)) {
                    doRecursiveCleanInDirectory(newPath);
                } else {
                    getTimeLastChangingOfFile(newPath, file)
                        .then(deleteFileIfItIsOld)
                        .catch(err => {
                            if (err) console.log(err);
                        });
                }
            });
        }
    });
};


let runCleaner = (dirPath) => {
    checkIfParameterItemExist(dirPath)
        .then(doRecursiveCleanInDirectory)
        .catch(err => console.error(err))
};

runCleaner(DIR_PATH);




