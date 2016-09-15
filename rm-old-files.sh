#!/bin/bash

for img in $( find _assets/img -name "*.png" -or -name "*.jpg" -or -name "*.gif" ); do
    img_file=`basename $img`
    ag --markdown --html --yaml --css --less "/$img_file" .
    total=$(expr $?)
    ag --markdown --html --yaml --css --less "asset_path $img_file" .
    total=$(expr $total + $?)
    ag --markdown --html --yaml --css --less "\"$img_file" .
    total=$(expr $total + $?)
    if [ $total -eq "3" ]; then
        echo "Found an image: $img_file"
        git rm $img
    fi
done

