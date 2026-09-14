#!/bin/bash

filename=$(find ./$1/ -type f -name "*" | sort)

for fn in $filename:
do 
  echo -e "!["$fn"]("$fn")\n" >> $1.md
done 
exit $?
